import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import EntryExit from "./pages/EntryExit";
import Alerts from "./pages/Alerts";
import Blacklisted from "./pages/Blacklisted";
import "./index.css";

// User pages
import UserDashboard from "./user/pages/UserDashboard";
import AdvanceBooking from "./user/pages/AdvanceBooking";
import BillingReceipt from "./user/pages/BillingReceipt";
import FindMyCar from "./user/pages/FindMyCar";
import EVCharging from "./user/pages/EVCharging";

function SimplePage({ title, text }) {
  return (
    <div className="content-page">
      <div className="panel-card">
        <h1 className="page-heading">{title}</h1>
        <p className="page-subtext">{text}</p>
      </div>
    </div>
  );
}

function AdminLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="layout-shell" style={{ flex: 1 }}>
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/entry-exit" element={<EntryExit />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/blacklisted" element={<Blacklisted />} />
            <Route
              path="/reports"
              element={
                <SimplePage
                  title="Reports"
                  text="Reports section for analytics and export can be added here."
                />
              }
            />
            <Route
              path="/settings"
              element={
                <SimplePage
                  title="Settings"
                  text="System settings and preferences panel can be added here."
                />
              }
            />
            <Route
              path="/login"
              element={
                <SimplePage
                  title="Login"
                  text="Login page UI can be added here."
                />
              }
            />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Panel Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/booking" element={<AdvanceBooking />} />
        <Route path="/user/billing" element={<BillingReceipt />} />
        <Route path="/user/find-car" element={<FindMyCar />} />
        <Route path="/user/ev-charging" element={<EVCharging />} />

        {/* Admin Panel Routes */}
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;