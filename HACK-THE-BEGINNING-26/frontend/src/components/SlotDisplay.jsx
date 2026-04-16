import React from "react";

function SlotDisplay({ slots = [] }) {
  const defaultSlots = [
    { slotNumber: "A1", isOccupied: false },
    { slotNumber: "A2", isOccupied: false },
    { slotNumber: "A3", isOccupied: false },
    { slotNumber: "A4", isOccupied: false },
    { slotNumber: "B1", isOccupied: false },
    { slotNumber: "B2", isOccupied: false },
    { slotNumber: "B3", isOccupied: false },
    { slotNumber: "B4", isOccupied: false },
    { slotNumber: "C1", isOccupied: false },
    { slotNumber: "C2", isOccupied: false },
  ];

  const displaySlots = slots.length ? slots : defaultSlots;

  return (
    <div className="slot-strip">
      {displaySlots.map((slot) => (
        <div
          key={slot.slotNumber}
          className={`slot-chip ${slot.isOccupied ? "occupied" : "free"}`}
        >
          <strong>{slot.slotNumber}</strong>
          <span>{slot.isOccupied ? "Busy" : "Free"}</span>
        </div>
      ))}
    </div>
  );
}

export default SlotDisplay;