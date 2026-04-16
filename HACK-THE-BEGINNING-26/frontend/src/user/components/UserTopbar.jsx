import React from "react";

function UserTopbar({ title, subtitle }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: "20px",
        padding: "20px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "22px",
      }}
    >
      <div>
        <h1 style={{ margin: 0, color: "#0f172a", fontSize: "32px" }}>{title}</h1>
        <p style={{ margin: "8px 0 0", color: "#64748b" }}>{subtitle}</p>
      </div>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "10px 16px",
          boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
        }}
      >
        <strong style={{ color: "#0f172a" }}>User Panel</strong>
      </div>
    </div>
  );
}

export default UserTopbar;