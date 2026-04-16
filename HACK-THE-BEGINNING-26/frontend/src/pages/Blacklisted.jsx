import React from "react";
import Navbar from "../components/Navbar";

function Blacklisted() {
  const blacklistedVehicles = [
    {
      plate: "AB01C1234",
      reason: "Unpaid parking bills",
      date: "10-04-2026",
      status: "Blocked",
    },
    {
      plate: "DL01AB1234",
      reason: "Unauthorized entry",
      date: "08-04-2026",
      status: "Blocked",
    },
  ];

  return (
    <div className="layout-shell">
      <Navbar />

      <main className="main-content">
        <div className="panel-card">
          <h1>🚫 Blacklisted Vehicles</h1>

          <table style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Vehicle Number</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {blacklistedVehicles.map((v, index) => (
                <tr key={index}>
                  <td>{v.plate}</td>
                  <td>{v.reason}</td>
                  <td>{v.date}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>
                    {v.status}
                  </td>
                  <td>
                    <button
                      style={{
                        background: "#15803d",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Allow
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Blacklisted;