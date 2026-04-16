import React from "react";

function DashboardStats({ stats }) {
  return (
    <div className="grid grid-3">
      <div className="stat-box">
        <h4>Total Entries Today</h4>
        <p>{stats.totalEntriesToday || 0}</p>
      </div>
      <div className="stat-box">
        <h4>Currently Parked</h4>
        <p>{stats.currentlyParked || 0}</p>
      </div>
      <div className="stat-box">
        <h4>Suspicious Vehicles</h4>
        <p>{stats.suspiciousCount || 0}</p>
      </div>
      <div className="stat-box">
        <h4>Blacklisted Hits</h4>
        <p>{stats.blacklistedCount || 0}</p>
      </div>
      <div className="stat-box">
        <h4>Free Slots</h4>
        <p>{stats.freeSlots || 0}</p>
      </div>
      <div className="stat-box">
        <h4>Peak Hour</h4>
        <p>{stats.peakHour || "--"}</p>
      </div>
    </div>
  );
}

export default DashboardStats;