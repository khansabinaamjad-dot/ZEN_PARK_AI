import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5001/api/parking";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API}/alerts`);
      setAlerts(res.data || []);
    } catch (error) {
      console.log("Alerts fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1 className="page-title">Security Alerts</h1>

      <div className="grid">
        {alerts.length === 0 ? (
          <div className="card">No alerts right now.</div>
        ) : (
          alerts.map((alert) => (
            <div className="card" key={alert._id}>
              <h3>{alert.plateNumber}</h3>
              <p>
                <strong>Status:</strong>{" "}
                {alert.isBlacklisted ? "BLACKLISTED" : "SUSPICIOUS"}
              </p>
              <p><strong>Slot:</strong> {alert.slot || "--"}</p>
              <p><strong>Type:</strong> {alert.type}</p>
              <p>
                <strong>Detected At:</strong>{" "}
                {new Date(alert.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Alerts;