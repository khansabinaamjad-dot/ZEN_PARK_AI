import React, { useState } from "react";

function FindCarBox() {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState(null);

  const handleFind = () => {
    if (!plate) return;

    setResult({
      slot: "A1",
      floor: "Ground Floor",
      zone: "Near Entry Gate",
      entryTime: "09:45 PM",
    });
  };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "22px",
        padding: "24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Find My Car</h2>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Enter vehicle number"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          style={{
            flex: 1,
            minWidth: "220px",
            padding: "12px 14px",
            borderRadius: "12px",
            border: "1px solid #dbeafe",
            outline: "none",
          }}
        />

        <button
          onClick={handleFind}
          style={{
            background: "#15803d",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Search
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: "18px",
            background: "#f8fafc",
            padding: "16px",
            borderRadius: "16px",
          }}
        >
          <p><strong>Slot:</strong> {result.slot}</p>
          <p><strong>Floor:</strong> {result.floor}</p>
          <p><strong>Zone:</strong> {result.zone}</p>
          <p><strong>Entry Time:</strong> {result.entryTime}</p>
        </div>
      )}
    </div>
  );
}

export default FindCarBox;