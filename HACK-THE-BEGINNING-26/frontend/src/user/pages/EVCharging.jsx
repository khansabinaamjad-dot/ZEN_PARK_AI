import React from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import EVStatusCard from "../components/EVStatusCard";

function EVCharging() {
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
          title="EV Charging"
          subtitle="Check EV charging availability and current status."
        />
        <EVStatusCard />
      </div>
    </div>
  );
}

export default EVCharging;