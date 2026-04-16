import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function UserSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard" },
    { name: "Advance Booking", path: "/user/booking" },
    { name: "Billing & Receipt", path: "/user/billing" },
    { name: "Find My Car", path: "/user/find-car" },
    { name: "EV Charging", path: "/user/ev-charging" },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px 18px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // 👈 important for bottom button
      }}
    >
      {/* TOP CONTENT */}
      <div>
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ margin: 0, color: "#0f172a" }}>ZEN PARK AI</h2>
          <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
            User Parking Panel
          </p>
        </div>

        <p
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#94a3b8",
            marginBottom: "12px",
          }}
        >
          MENU
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: "none",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  fontWeight: "600",
                  background: isActive ? "#15803d" : "#f8fafc",
                  color: isActive ? "#ffffff" : "#0f172a",
                  transition: "0.2s",
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ACTION */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background: "#0f172a",
            color: "#ffffff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          🔙 Back to Admin Panel
        </button>
      </div>
    </div>
  );
}

export default UserSidebar;