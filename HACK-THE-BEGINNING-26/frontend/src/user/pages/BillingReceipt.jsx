import React from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import ReceiptCard from "../components/ReceiptCard";

function BillingReceipt() {
  const receipts = [
    { receiptNo: "1001", amount: 40, date: "10-04-2026", status: "Paid" },
    { receiptNo: "1002", amount: 60, date: "08-04-2026", status: "Paid" },
    { receiptNo: "1003", amount: 25, date: "04-04-2026", status: "Paid" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "22px",
        padding: "20px",
        background: "#eef2f7",
        minHeight: "100vh",
      }}
    >
      <UserSidebar />

      <div style={{ flex: 1 }}>
        <UserTopbar
          title="Billing & Receipt"
          subtitle="View current parking bill and past receipts."
        />

        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Current Billing</h2>
          <p><strong>Vehicle:</strong> HR98AA1771</p>
          <p><strong>Parking Time:</strong> 2 Hours</p>
          <p><strong>Total Amount:</strong> ₹40</p>
          <p style={{ color: "#15803d", fontWeight: "600" }}>Status: Unpaid</p>
        </div>

        <h2>Past Receipts</h2>
        {receipts.map((receipt) => (
          <ReceiptCard key={receipt.receiptNo} {...receipt} />
        ))}
      </div>
    </div>
  );
}

export default BillingReceipt;