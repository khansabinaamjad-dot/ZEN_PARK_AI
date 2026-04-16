import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/logo.png" alt="logo" className="sidebar-logo" />
        <div>
          <h2>ZEN PARK AI</h2>
          <span>Smart Parking Panel</span>
        </div>
      </div>

      <div className="sidebar-section-title">MENU</div>

      <nav className="sidebar-links">
        <Link className={isActive("/") ? "active" : ""} to="/">
          Dashboard
        </Link>

        <Link className={isActive("/entry-exit") ? "active" : ""} to="/entry-exit">
          Entry / Exit
        </Link>

        <Link className={isActive("/alerts") ? "active" : ""} to="/alerts">
          Alerts
        </Link>

        <Link className={isActive("/reports") ? "active" : ""} to="/reports">
          Reports
        </Link>

        {/* ✅ NEW BLACKLIST LINK */}
        <Link
          className={isActive("/blacklisted") ? "active" : ""}
          to="/blacklisted"
        >
          🚫 Blacklisted Vehicles
        </Link>
      </nav>

      <div className="sidebar-section-title">GENERAL</div>

      <nav className="sidebar-links">
        <Link className={isActive("/settings") ? "active" : ""} to="/settings">
          Settings
        </Link>
        <Link className={isActive("/login") ? "active" : ""} to="/login">
          Login
        </Link>
      </nav>

      {/* USER PANEL (same as before) */}
      <div className="sidebar-section-title">USER PANEL</div>

      <nav className="sidebar-links">
        <Link
          className={isActive("/user/dashboard") ? "active" : ""}
          to="/user/dashboard"
        >
          User Dashboard
        </Link>

        <Link
          className={isActive("/user/booking") ? "active" : ""}
          to="/user/booking"
        >
          Book Slot
        </Link>

        <Link
          className={isActive("/user/billing") ? "active" : ""}
          to="/user/billing"
        >
          Billing
        </Link>

        <Link
          className={isActive("/user/find-car") ? "active" : ""}
          to="/user/find-car"
        >
          Find My Car
        </Link>

        <Link
          className={isActive("/user/ev-charging") ? "active" : ""}
          to="/user/ev-charging"
        >
          EV Charging
        </Link>
      </nav>

      <div className="sidebar-status">
        <h4>System Status</h4>

        <div className="status-item">
          <span>Total Slots</span>
          <strong>10</strong>
        </div>

        <div className="status-item">
          <span>Free Slots</span>
          <strong>9</strong>
        </div>

        <div className="status-item">
          <span>Status</span>
          <strong className="online">Online</strong>
        </div>
      </div>

      <div className="sidebar-actions">
        <button>🚗 Add Entry</button>
        <button>🚪 Open Gate</button>
        <button>⚠ Alert</button>
      </div>

      <div className="sidebar-info">
        <p>AI Enabled Parking</p>
        <p>ANPR System Active</p>
      </div>
    </aside>
  );
}

export default Navbar;