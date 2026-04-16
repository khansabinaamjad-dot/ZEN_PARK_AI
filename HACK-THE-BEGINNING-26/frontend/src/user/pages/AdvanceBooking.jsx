import React from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import BookingForm from "../components/BookingForm";

function AdvanceBooking() {
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
          title="Advance Booking"
          subtitle="Reserve your parking slot in advance."
        />
        <BookingForm />
      </div>
    </div>
  );
}

export default AdvanceBooking;