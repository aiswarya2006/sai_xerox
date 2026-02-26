import React, { useEffect, useState } from "react";
import "./Adminorderplaced.css";
import { Printer, CheckCircle, Clock } from "lucide-react";

export default function Adminorderplaced() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("LATEST");

  // FETCH ORDERS FROM SPRING BOOT
  useEffect(() => {
    fetch("http://localhost:8080/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, []);

  // UPDATE STATUS IN BACKEND
  const handleStatusChange = (orderId, nextStatus) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus.toUpperCase() }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      });
  };

  const handlePrint = (order) => {
    const file = order.fileNames.split(",")[0];
    const url = `http://localhost:8080/api/orders/file/${encodeURIComponent(file)}`;

    // open file directly
    const win = window.open(url, "_blank");

    // optional auto print after load
    if (win) {
      win.onload = () => {
        win.print();
      };
    }
  };

  const filteredOrders = [...orders]
    .filter((o) => {
      const statusMatch = statusFilter === "ALL" || o.status === statusFilter;
      const typeMatch = typeFilter === "ALL" || o.printType === typeFilter;
      return statusMatch && typeMatch;
    })
    .sort((a, b) => {
      if (sortBy === "LATEST") return b.id - a.id;
      if (sortBy === "OLDEST") return a.id - b.id;
      if (sortBy === "PRICE_HIGH") return b.totalPrice - a.totalPrice;
      if (sortBy === "PRICE_LOW") return a.totalPrice - b.totalPrice;
      return 0;
    });

  return (
    <div className="admin-orders">
      <header className="admin-orders__header">
        <div className="admin-orders__brand">
          <div className="admin-orders__logo">
            <Printer size={22} />
          </div>
          <div>
            <p className="admin-orders__eyebrow">Admin Dashboard</p>
            <h1>Order Management</h1>
          </div>
        </div>

        <div className="admin-orders__actions">
          <button
            className="admin-orders__ghost admin-orders__back-btn"
            onClick={() => (window.location.href = "/")}
          >
            ← Back to Home
          </button>
        </div>
      </header>

      <section className="admin-orders__table-card">
        <div className="admin-orders__filters">
          <label>
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>

          <label>
            Print Type
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="color">Color</option>
              <option value="bw">B/W</option>
            </select>
          </label>

          <label>
            Sort
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="LATEST">Latest</option>
              <option value="OLDEST">Oldest</option>
              <option value="PRICE_HIGH">Price High</option>
              <option value="PRICE_LOW">Price Low</option>
            </select>
          </label>
        </div>

        <div className="admin-orders__table-wrap">
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Print Type</th>
                <th>Total</th>
                <th>Phone</th>
                <th>Paper Size</th>
                <th>Binding</th>
                <th>Copies</th>
                <th>Files</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => {
                const isCompleted = order.status === "COMPLETED";

                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.printType}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>{order.phone}</td>
                    <td>{order.paperSize}</td>
                    <td>{order.binding}</td>
                    <td>{order.copies}</td>

                    <td>
                      {(() => {
                        const file = order.fileNames?.split(",")[0];

                        return (
                          <span
                            className="admin-orders__file-name"
                            style={{ cursor: "pointer", color: "#2563eb", fontWeight: 500 }}
                            onClick={() =>
                              window.open(
                                `http://localhost:8080/api/orders/file/${encodeURIComponent(file)}`,
                                "_blank"
                              )
                            }
                          >
                            {file}
                          </span>
                        );
                      })()}
                    </td>

                    <td>
                      <div
                        className={`admin-orders__status-pill ${
                          isCompleted
                            ? "admin-orders__status--completed"
                            : "admin-orders__status--pending"
                        }`}
                      >
                        {isCompleted ? <CheckCircle size={14} /> : <Clock size={14} />}

                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <button className="admin-orders__print" onClick={() => handlePrint(order)}>
                        Print
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedOrder && (
        <div className="admin-orders__modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-orders__modal" onClick={(e) => e.stopPropagation()}>
            <h3>Files</h3>
            <p>{selectedOrder.fileNames}</p>
            <button onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
