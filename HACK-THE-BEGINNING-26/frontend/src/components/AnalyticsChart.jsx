import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AnalyticsChart({ stats }) {
  const totalSlots = 10;
  const freeSlots = stats.freeSlots || 0;
  const occupiedSlots = Math.max(0, totalSlots - freeSlots);
  const alertCount =
    (stats.suspiciousCount || 0) + (stats.blacklistedCount || 0);

  const barData = [
    { name: "Entries", value: stats.totalEntriesToday || 0 },
    { name: "Parked", value: stats.currentlyParked || 0 },
    { name: "Alerts", value: alertCount },
  ];

  const pieData = [
    { name: "Free", value: freeSlots },
    { name: "Occupied", value: occupiedSlots },
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  return (
    <div className="analytics-wrapper">
      <div className="mini-chart-block">
        <h4 className="mini-chart-title">Activity Overview</h4>
        <div className="mini-chart-box">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mini-chart-block">
        <h4 className="mini-chart-title">Slot Availability</h4>
        <div className="mini-chart-box">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="chart-legend compact">
            <div>
              <span className="dot green"></span>
              Free
            </div>
            <div>
              <span className="dot red"></span>
              Occupied
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsChart;