const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    image: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      enum: ["ENTRY", "EXIT"],
      required: true
    },
    status: {
      type: String,
      enum: ["NORMAL", "SUSPICIOUS", "BLACKLISTED", "ENTRY_DENIED"],
      default: "NORMAL"
    },
    confidence: {
      type: Number,
      default: 0
    },
    slot: {
      type: String,
      default: null
    },
    inTime: {
      type: Date,
      default: null
    },
    outTime: {
      type: Date,
      default: null
    },
    durationMinutes: {
      type: Number,
      default: 0
    },
    isBlacklisted: {
      type: Boolean,
      default: false
    },
    isSuspicious: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parking", parkingSchema);