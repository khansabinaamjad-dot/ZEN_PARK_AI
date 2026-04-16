import React from "react";

function EVStatusCard() {
  const evData = {
    total: 4,
    occupied: 2,
    free: 2,
    chargingActive: "Yes",
    waiting: 1,
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
      <h2 style={{ marginTop: 0 }}>EV Charging Status</h2>

      <div style={{ display: "grid", gap: "10px" }}>
        <p><strong>Total EV Slots:</strong> {evData.total}</p>
        <p><strong>Occupied:</strong> {evData.occupied}</p>
        <p><strong>Free:</strong> {evData.free}</p>
        <p><strong>Charging Active:</strong> {evData.chargingActive}</p>
        <p><strong>Waiting Queue:</strong> {evData.waiting}</p>
      </div>
    </div>
  );
}

export default EVStatusCard;