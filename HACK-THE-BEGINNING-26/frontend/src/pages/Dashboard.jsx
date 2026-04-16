import React, { useEffect, useState } from "react";
import axios from "axios";
import CameraFeed from "../components/CameraFeed";
import SlotDisplay from "../components/SlotDisplay";
import AnalyticsChart from "../components/AnalyticsChart";

const API = "http://localhost:5001/api/parking";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEntriesToday: 0,
    currentlyParked: 0,
    suspiciousCount: 0,
    blacklistedCount: 0,
    freeSlots: 10,
    peakHour: "--",
  });

  const [slots, setSlots] = useState([]);
  const [recentRecord, setRecentRecord] = useState(null);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API}/dashboard`);
      setStats(res.data.stats || {});
      setSlots(res.data.slots || []);
    } catch (error) {
      console.log("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-page">
      <div className="topbar">
        <div>
          <h1 className="page-heading">Dashboard</h1>
          <p className="page-subtext">
            Monitor vehicle entry, ANPR detection, alerts, and parking occupancy.
          </p>
        </div>

        <div className="topbar-right">
          <div className="search-box">Search dashboard</div>
          <div className="profile-box">
            <img src="/logo.png" alt="profile" />
            <div>
              <strong>ZEN PARK AI</strong>
              <span>Admin Panel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="panel-card stat-card stat-highlight">
          <h4>Total Entries Today</h4>
          <h2>{stats.totalEntriesToday || 0}</h2>
          <p>Vehicles detected today</p>
        </div>

        <div className="panel-card stat-card">
          <h4>Currently Parked</h4>
          <h2>{stats.currentlyParked || 0}</h2>
          <p>Vehicles inside parking</p>
        </div>

        <div className="panel-card stat-card">
          <h4>Free Slots</h4>
          <h2>{stats.freeSlots || 0}</h2>
          <p>Available right now</p>
        </div>

        <div className="panel-card stat-card">
          <h4>Security Alerts</h4>
          <h2>{(stats.suspiciousCount || 0) + (stats.blacklistedCount || 0)}</h2>
          <p>Suspicious + blacklisted</p>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="left-column">
          <div className="panel-card compact-camera-card">
            <div className="panel-header-row">
              <h3>Live ANPR Camera</h3>
              <span className="panel-badge">Live</span>
            </div>

            <div className="camera-compact-wrap">
              <CameraFeed
                onDetectionComplete={(data) => {
                  setRecentRecord(data);
                  fetchDashboard();
                }}
              />
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-header-row">
              <h3>Parking Slots</h3>
              <span className="panel-badge alt">{stats.freeSlots || 0} Free</span>
            </div>
            <SlotDisplay slots={slots} />
          </div>
        </div>

        <div className="right-column">
          <div className="panel-card">
            <div className="panel-header-row">
              <h3>Last Detection</h3>
              <span className="panel-badge">Recent</span>
            </div>

            {recentRecord ? (
              <div className="info-list">
                <div className="info-item">
                  <span>Plate</span>
                  <strong>{recentRecord.plateNumber || "--"}</strong>
                </div>
                <div className="info-item">
                  <span>Status</span>
                  <strong>{recentRecord.status || "--"}</strong>
                </div>
                <div className="info-item">
                  <span>Action</span>
                  <strong>{recentRecord.action || "--"}</strong>
                </div>
                <div className="info-item">
                  <span>Slot</span>
                  <strong>{recentRecord.slot || "--"}</strong>
                </div>
                <div className="info-item">
                  <span>Confidence</span>
                  <strong>{recentRecord.confidence || 0}%</strong>
                </div>
              </div>
            ) : (
              <div className="empty-box">
                No detection yet. Camera activity will appear here.
              </div>
            )}
          </div>

          <div className="panel-card">
            <div className="panel-header-row">
              <h3>Analytics</h3>
              <span className="panel-badge alt">Live</span>
            </div>
            <AnalyticsChart stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;