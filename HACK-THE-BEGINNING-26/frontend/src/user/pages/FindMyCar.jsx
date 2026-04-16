import React from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import FindCarBox from "../components/FindCarBox";

function FindMyCar() {
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
          title="Find My Car"
          subtitle="Search your parked vehicle location instantly."
        />
        <FindCarBox />
      </div>
    </div>
  );
}

export default FindMyCar;