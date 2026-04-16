import React from "react";

function AlertBox({ status, message }) {
  if (!message) return null;

  let className = "alert-box alert-normal";

  if (status === "SUSPICIOUS") className = "alert-box alert-warning";
  if (status === "BLACKLISTED" || status === "ENTRY_DENIED") {
    className = "alert-box alert-danger";
  }

  return <div className={className}>{message}</div>;
}

export default AlertBox;