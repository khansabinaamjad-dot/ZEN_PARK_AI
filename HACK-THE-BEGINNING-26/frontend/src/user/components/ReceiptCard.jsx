import React from "react";

function ReceiptCard({ receiptNo, amount, date, status }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "18px",
        padding: "18px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        marginBottom: "14px",
      }}
    >
      <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>Receipt #{receiptNo}</h3>
      <p style={{ margin: "4px 0", color: "#475569" }}>Amount: ₹{amount}</p>
      <p style={{ margin: "4px 0", color: "#475569" }}>Date: {date}</p>
      <p style={{ margin: "4px 0", color: "#15803d", fontWeight: "600" }}>
        Status: {status}
      </p>
    </div>
  );
}

export default ReceiptCard;