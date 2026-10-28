import React, { useEffect, useState } from "react";
import { api } from "../services/api";

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
];

export default function AdminOrders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const response = await api.get("/orders");
      setRows(response.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setRows((current) =>
        current.map((order) => (order._id === id ? { ...order, status } : order))
      );
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Status update failed");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="page-title mb-1">Orders</h1>
          <p className="text-muted mb-0">Every successfully placed order is listed here.</p>
        </div>
        <button className="btn btn-outline-gold" onClick={load}>Refresh</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="empty-box">Loading orders...</div>
      ) : rows.length === 0 ? (
        <div className="empty-box">
          <h4>No orders yet</h4>
          <p className="text-muted mb-0">Place a customer order and it will appear here.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Delivery / Payment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o._id}>
                  <td>
                    <b>{o.orderNumber}</b>
                    <small className="d-block text-muted">
                      {new Date(o.createdAt).toLocaleString()}
                    </small>
                  </td>
                  <td>
                    <b>{o.customer?.name}</b>
                    <small className="d-block">{o.customer?.phone}</small>
                    {o.customer?.email && <small className="d-block">{o.customer.email}</small>}
                    {o.customer?.address && (
                      <small className="d-block text-muted">{o.customer.address}</small>
                    )}
                  </td>
                  <td style={{ minWidth: 220 }}>
                    {(o.items || []).map((i) => (
                      <div key={`${o._id}-${i.product || i.name}`}>
                        {i.name} × {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td>
                    <span className="text-capitalize">{String(o.fulfilment || "").replaceAll("_", " ")}</span>
                    <small className="d-block text-muted text-capitalize">
                      {String(o.paymentMethod || "").replaceAll("_", " ")}
                    </small>
                  </td>
                  <td><b>£{Number(o.total || 0).toFixed(2)}</b></td>
                  <td style={{ minWidth: 180 }}>
                    <select
                      className="form-select form-select-sm rb-input"
                      value={o.status}
                      onChange={(e) => changeStatus(o._id, e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
