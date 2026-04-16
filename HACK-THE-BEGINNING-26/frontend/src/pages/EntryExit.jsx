import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5001/api/parking";

function getBadgeClass(status) {
  if (status === "BLACKLISTED" || status === "ENTRY_DENIED") return "badge danger";
  if (status === "SUSPICIOUS") return "badge warning";
  return "badge normal";
}

function EntryExit() {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API}/records`);
      setRecords(res.data || []);
    } catch (error) {
      console.log("Records fetch error:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
    const interval = setInterval(fetchRecords, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1 className="page-title">Entry / Exit Logs</h1>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Plate</th>
              <th>Type</th>
              <th>Status</th>
              <th>Slot</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item) => (
              <tr key={item._id}>
                <td>{item.plateNumber}</td>
                <td>{item.type}</td>
                <td>
                  <span className={getBadgeClass(item.status)}>
                    {item.status}
                  </span>
                </td>
                <td>{item.slot || "--"}</td>
                <td>
                  {item.inTime ? new Date(item.inTime).toLocaleString() : "--"}
                </td>
                <td>
                  {item.outTime ? new Date(item.outTime).toLocaleString() : "--"}
                </td>
                <td>{item.confidence || 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EntryExit;