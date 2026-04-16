import React, { useState } from "react";

function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    plate: "",
    date: "",
    time: "",
    slotType: "Normal",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBooking = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.plate || !formData.date || !formData.time) {
      setMessage("Please fill all fields.");
      return;
    }

    setMessage("Advance booking created successfully.");
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
      <h2 style={{ marginTop: 0 }}>Advance Booking</h2>

      <form onSubmit={handleBooking} style={{ display: "grid", gap: "14px" }}>
        <input
          type="text"
          name="name"
          placeholder="Enter user name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="plate"
          placeholder="Enter vehicle number"
          value={formData.plate}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="slotType"
          value={formData.slotType}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="Normal">Normal Slot</option>
          <option value="EV">EV Charging Slot</option>
          <option value="VIP">VIP Slot</option>
        </select>

        <button
          type="submit"
          style={{
            background: "#15803d",
            color: "#ffffff",
            border: "none",
            padding: "14px",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Book Now
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "14px",
            color: message.includes("successfully") ? "green" : "red",
            fontWeight: "600",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #dbeafe",
  outline: "none",
  fontSize: "14px",
};

export default BookingForm;