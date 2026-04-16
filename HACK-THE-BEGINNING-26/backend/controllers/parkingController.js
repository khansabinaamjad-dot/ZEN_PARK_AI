const { createWorker } = require("tesseract.js");
const Parking = require("../models/Parking");

const blacklist = [ "AB01C1234", "DL01BLACK1"];

const parkingSlots = [
  "A1", "A2", "A3", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2"
];

let workerInstance = null;
let memoryRecords = [];

async function getWorker() {
  if (!workerInstance) {
    workerInstance = await createWorker("eng");
  }
  return workerInstance;
}

function extractPlate(text) {
  const cleaned = (text || "").replace(/[^A-Z0-9]/gi, "").toUpperCase();

  const patterns = [
    /[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}/,
    /[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}/,
    /[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}/
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) return match[0];
  }

  return null;
}

async function readPlateFromImage(imageBase64) {
  const worker = await getWorker();
  const {
    data: { text, confidence }
  } = await worker.recognize(imageBase64);

  const plateNumber = extractPlate(text || "");
  return {
    plateNumber,
    confidence: Math.round(confidence || 0),
    rawText: text || ""
  };
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// -------------------- MEMORY MODE HELPERS --------------------

function memoryGetUsedSlots() {
  return memoryRecords
    .filter((item) => item.type === "ENTRY" && item.outTime === null)
    .map((item) => item.slot)
    .filter(Boolean);
}

function memoryAssignFreeSlot() {
  const usedSlots = memoryGetUsedSlots();
  return parkingSlots.find((slot) => !usedSlots.includes(slot)) || null;
}

function memoryIsSuspiciousVehicle(plateNumber) {
  const last24h = Date.now() - 24 * 60 * 60 * 1000;
  const count = memoryRecords.filter(
    (item) =>
      item.plateNumber === plateNumber &&
      new Date(item.createdAt).getTime() >= last24h
  ).length;

  return count >= 3;
}

// -------------------- MONGO MODE HELPERS --------------------

async function mongoGetUsedSlots() {
  const activeEntries = await Parking.find({
    type: "ENTRY",
    outTime: null
  }).select("slot");

  return activeEntries.map((item) => item.slot).filter(Boolean);
}

async function mongoAssignFreeSlot() {
  const usedSlots = await mongoGetUsedSlots();
  return parkingSlots.find((slot) => !usedSlots.includes(slot)) || null;
}

async function mongoIsSuspiciousVehicle(plateNumber) {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const count = await Parking.countDocuments({
    plateNumber,
    createdAt: { $gte: last24h }
  });

  return count >= 3;
}

// -------------------- DETECT --------------------

async function detectPlate(req, res) {
  try {
    const { image } = req.body;
    const isMongoConnected = req.isMongoConnected;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const ocr = await readPlateFromImage(image);

    if (!ocr.plateNumber) {
      return res.status(422).json({
        status: "SUSPICIOUS",
        message: "Plate not read clearly. Move vehicle closer and retry."
      });
    }

    const plateNumber = ocr.plateNumber.toUpperCase();
    const blacklisted = blacklist.includes(plateNumber);

    if (isMongoConnected) {
      const suspicious = await mongoIsSuspiciousVehicle(plateNumber);

      const activeEntry = await Parking.findOne({
        plateNumber,
        type: "ENTRY",
        outTime: null
      }).sort({ createdAt: -1 });

      if (activeEntry) {
        const outTime = new Date();
        const durationMinutes = Math.max(
          1,
          Math.round((outTime - new Date(activeEntry.inTime)) / 60000)
        );

        const exitRecord = await Parking.create({
          plateNumber,
          image,
          type: "EXIT",
          status: blacklisted
            ? "BLACKLISTED"
            : suspicious
            ? "SUSPICIOUS"
            : "NORMAL",
          confidence: ocr.confidence,
          slot: activeEntry.slot,
          inTime: activeEntry.inTime,
          outTime,
          durationMinutes,
          isBlacklisted: blacklisted,
          isSuspicious: suspicious
        });

        activeEntry.outTime = outTime;
        activeEntry.durationMinutes = durationMinutes;
        await activeEntry.save();

        return res.json({
          action: "EXIT",
          plateNumber,
          slot: exitRecord.slot,
          confidence: ocr.confidence,
          status: exitRecord.status,
          message: blacklisted
            ? `Blacklisted vehicle ${plateNumber} exited from slot ${exitRecord.slot}`
            : suspicious
            ? `Suspicious vehicle ${plateNumber} exited from slot ${exitRecord.slot}`
            : `Vehicle ${plateNumber} exited successfully from slot ${exitRecord.slot}`
        });
      }

      const slot = await mongoAssignFreeSlot();

      if (!slot) {
        return res.status(400).json({
          plateNumber,
          status: "ENTRY_DENIED",
          message: "Parking full. No free slot available."
        });
      }

      const status = blacklisted
        ? "BLACKLISTED"
        : suspicious
        ? "SUSPICIOUS"
        : "NORMAL";

      const entryRecord = await Parking.create({
        plateNumber,
        image,
        type: "ENTRY",
        status,
        confidence: ocr.confidence,
        slot,
        inTime: new Date(),
        isBlacklisted: blacklisted,
        isSuspicious: suspicious
      });

      return res.json({
        action: blacklisted ? "BLOCKED_ENTRY" : "ENTRY",
        plateNumber,
        slot,
        confidence: ocr.confidence,
        status,
        message: blacklisted
          ? `Blacklisted vehicle detected: ${plateNumber}. Entry denied alert generated.`
          : suspicious
          ? `Suspicious vehicle ${plateNumber} entered. Slot assigned: ${slot}`
          : `Vehicle ${plateNumber} entered successfully. Slot assigned: ${slot}`,
        data: entryRecord
      });
    }

    // MEMORY MODE
    const suspicious = memoryIsSuspiciousVehicle(plateNumber);

    const activeEntry = [...memoryRecords]
      .reverse()
      .find(
        (item) =>
          item.plateNumber === plateNumber &&
          item.type === "ENTRY" &&
          item.outTime === null
      );

    if (activeEntry) {
      const outTime = new Date();
      const durationMinutes = Math.max(
        1,
        Math.round((outTime - new Date(activeEntry.inTime)) / 60000)
      );

      activeEntry.outTime = outTime;
      activeEntry.durationMinutes = durationMinutes;
      activeEntry.updatedAt = new Date();

      const exitRecord = {
        _id: makeId(),
        plateNumber,
        image,
        type: "EXIT",
        status: blacklisted
          ? "BLACKLISTED"
          : suspicious
          ? "SUSPICIOUS"
          : "NORMAL",
        confidence: ocr.confidence,
        slot: activeEntry.slot,
        inTime: activeEntry.inTime,
        outTime,
        durationMinutes,
        isBlacklisted: blacklisted,
        isSuspicious: suspicious,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      memoryRecords.push(exitRecord);

      return res.json({
        action: "EXIT",
        plateNumber,
        slot: exitRecord.slot,
        confidence: ocr.confidence,
        status: exitRecord.status,
        message: blacklisted
          ? `Blacklisted vehicle ${plateNumber} exited from slot ${exitRecord.slot}`
          : suspicious
          ? `Suspicious vehicle ${plateNumber} exited from slot ${exitRecord.slot}`
          : `Vehicle ${plateNumber} exited successfully from slot ${exitRecord.slot}`
      });
    }

    const slot = memoryAssignFreeSlot();

    if (!slot) {
      return res.status(400).json({
        plateNumber,
        status: "ENTRY_DENIED",
        message: "Parking full. No free slot available."
      });
    }

    const status = blacklisted
      ? "BLACKLISTED"
      : suspicious
      ? "SUSPICIOUS"
      : "NORMAL";

    const entryRecord = {
      _id: makeId(),
      plateNumber,
      image,
      type: "ENTRY",
      status,
      confidence: ocr.confidence,
      slot,
      inTime: new Date(),
      outTime: null,
      durationMinutes: 0,
      isBlacklisted: blacklisted,
      isSuspicious: suspicious,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    memoryRecords.push(entryRecord);

    return res.json({
      action: blacklisted ? "BLOCKED_ENTRY" : "ENTRY",
      plateNumber,
      slot,
      confidence: ocr.confidence,
      status,
      message: blacklisted
        ? `Blacklisted vehicle detected: ${plateNumber}. Entry denied alert generated.`
        : suspicious
        ? `Suspicious vehicle ${plateNumber} entered. Slot assigned: ${slot}`
        : `Vehicle ${plateNumber} entered successfully. Slot assigned: ${slot}`,
      data: entryRecord
    });
  } catch (error) {
    console.log("Detect error:", error.message);
    return res.status(500).json({
      message: "Detection failed due to server error"
    });
  }
}

// -------------------- DASHBOARD --------------------

async function getDashboard(req, res) {
  try {
    const isMongoConnected = req.isMongoConnected;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (isMongoConnected) {
      const totalEntriesToday = await Parking.countDocuments({
        type: "ENTRY",
        createdAt: { $gte: todayStart }
      });

      const currentlyParked = await Parking.countDocuments({
        type: "ENTRY",
        outTime: null
      });

      const suspiciousCount = await Parking.countDocuments({
        isSuspicious: true,
        createdAt: { $gte: todayStart }
      });

      const blacklistedCount = await Parking.countDocuments({
        isBlacklisted: true,
        createdAt: { $gte: todayStart }
      });

      const usedSlots = await mongoGetUsedSlots();

      const slots = parkingSlots.map((slotNumber) => ({
        slotNumber,
        isOccupied: usedSlots.includes(slotNumber)
      }));

      const records = await Parking.find({
        type: "ENTRY",
        createdAt: { $gte: todayStart }
      });

      const hourMap = {};
      records.forEach((rec) => {
        const hour = new Date(rec.createdAt).getHours();
        hourMap[hour] = (hourMap[hour] || 0) + 1;
      });

      let peakHour = "--";
      let maxCount = 0;

      Object.keys(hourMap).forEach((hour) => {
        if (hourMap[hour] > maxCount) {
          maxCount = hourMap[hour];
          peakHour = `${hour}:00`;
        }
      });

      return res.json({
        stats: {
          totalEntriesToday,
          currentlyParked,
          suspiciousCount,
          blacklistedCount,
          freeSlots: parkingSlots.length - usedSlots.length,
          peakHour
        },
        slots
      });
    }

    // MEMORY MODE
    const todayEntries = memoryRecords.filter(
      (item) =>
        item.type === "ENTRY" &&
        new Date(item.createdAt) >= todayStart
    );

    const totalEntriesToday = todayEntries.length;

    const currentlyParked = memoryRecords.filter(
      (item) => item.type === "ENTRY" && item.outTime === null
    ).length;

    const suspiciousCount = memoryRecords.filter(
      (item) => item.isSuspicious && new Date(item.createdAt) >= todayStart
    ).length;

    const blacklistedCount = memoryRecords.filter(
      (item) => item.isBlacklisted && new Date(item.createdAt) >= todayStart
    ).length;

    const usedSlots = memoryGetUsedSlots();

    const slots = parkingSlots.map((slotNumber) => ({
      slotNumber,
      isOccupied: usedSlots.includes(slotNumber)
    }));

    const hourMap = {};
    todayEntries.forEach((rec) => {
      const hour = new Date(rec.createdAt).getHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });

    let peakHour = "--";
    let maxCount = 0;

    Object.keys(hourMap).forEach((hour) => {
      if (hourMap[hour] > maxCount) {
        maxCount = hourMap[hour];
        peakHour = `${hour}:00`;
      }
    });

    return res.json({
      stats: {
        totalEntriesToday,
        currentlyParked,
        suspiciousCount,
        blacklistedCount,
        freeSlots: parkingSlots.length - usedSlots.length,
        peakHour
      },
      slots
    });
  } catch (error) {
    console.log("Dashboard error:", error.message);
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
}

// -------------------- RECORDS --------------------

async function getRecords(req, res) {
  try {
    const isMongoConnected = req.isMongoConnected;

    if (isMongoConnected) {
      const records = await Parking.find().sort({ createdAt: -1 }).limit(50);
      return res.json(records);
    }

    const records = [...memoryRecords].reverse().slice(0, 50);
    return res.json(records);
  } catch (error) {
    console.log("Records error:", error.message);
    return res.status(500).json({ message: "Failed to fetch records" });
  }
}

// -------------------- ALERTS --------------------

async function getAlerts(req, res) {
  try {
    const isMongoConnected = req.isMongoConnected;

    if (isMongoConnected) {
      const alerts = await Parking.find({
        $or: [{ isBlacklisted: true }, { isSuspicious: true }]
      })
        .sort({ createdAt: -1 })
        .limit(20);

      return res.json(alerts);
    }

    const alerts = [...memoryRecords]
      .filter((item) => item.isBlacklisted || item.isSuspicious)
      .reverse()
      .slice(0, 20);

    return res.json(alerts);
  } catch (error) {
    console.log("Alerts error:", error.message);
    return res.status(500).json({ message: "Failed to fetch alerts" });
  }
}

module.exports = {
  detectPlate,
  getDashboard,
  getRecords,
  getAlerts
};