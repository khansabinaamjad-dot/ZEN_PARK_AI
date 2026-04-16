import React from "react";

function SlotCard({ title, value, subtitle, active }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: "220px",
        background: active ? "#15803d" : "#ffffff",
        color: active ? "#ffffff" : "#0f172a",
        borderRadius: "22px",
        padding: "24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "20px" }}>{title}</h3>
      <h1 style={{ margin: "14px 0 10px", fontSize: "46px" }}>{value}</h1>
      <p style={{ margin: 0, color: active ? "#dcfce7" : "#64748b" }}>{subtitle}</p>
    </div>
  );
}

export default SlotCard;