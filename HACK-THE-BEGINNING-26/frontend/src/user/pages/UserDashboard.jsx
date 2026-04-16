import React from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import SlotCard from "../components/SlotCard";
import BookingForm from "../components/BookingForm";
import FindCarBox from "../components/FindCarBox";
import EVStatusCard from "../components/EVStatusCard";

function UserDashboard() {
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
          title="User Dashboard"
          subtitle="Book slots, view billing, locate car, and check EV charging availability."
        />

        <div
          style={{
            display: "flex",
            gap: "18px",
            flexWrap: "wrap",
            marginBottom: "22px",
          }}
        >
          <SlotCard
            title="Available Slots"
            value="9"
            subtitle="Live free parking spaces"
            active={true}
          />
          <SlotCard
            title="My Active Booking"
            value="A1"
            subtitle="Today 10:00 AM"
          />
          <SlotCard
            title="Current Bill"
            value="₹40"
            subtitle="Parking charges till now"
          />
          <SlotCard
            title="EV Slots Free"
            value="2"
            subtitle="Charging spaces available"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "20px",
          }}
        >
          <BookingForm />
          <EVStatusCard />
        </div>

        <div style={{ marginTop: "20px" }}>
          <FindCarBox />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;