import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((response) => setStats(response.data.stats || {}))
      .catch((error) => console.error("Dashboard load failed:", error));
  }, []);

  const cards = [
    ["Revenue", `£${Number(stats.revenue || 0).toFixed(2)}`, "bi-cash-stack"],
    ["Orders", stats.orders || 0, "bi-receipt"],
    ["Products", stats.products || 0, "bi-box"],
    ["Users", stats.users || 0, "bi-people"],
    ["New contacts", stats.newContacts || 0, "bi-envelope"],
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="eyebrow">ADMIN</span>
          <h1 className="page-title mb-0">Dashboard</h1>
        </div>
      </div>

      <div className="row g-3">
        {cards.map(([name, value, icon]) => (
          <div className="col-md-6 col-xl" key={name}>
            <div className="stat-card">
              <i className={`bi ${icon}`}></i>
              <small>{name}</small>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
