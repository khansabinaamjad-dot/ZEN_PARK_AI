import React from "react";

function Footer() {
  return (
    <footer
      style={{
        padding: "14px 20px",
        background: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        textAlign: "center",
        fontSize: "14px",
        color: "#64748b",
      }}
    >
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} ZEN PARK AI | Made with ❤️ by{" "}
        <strong style={{ color: "#15803d" }}>TEAM SYNERGY</strong>
        <br />
        AI Powered Smart Parking System 🚗
      </p>
    </footer>
  );
}

export default Footer;