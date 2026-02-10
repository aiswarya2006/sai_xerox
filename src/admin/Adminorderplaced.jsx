import React, { useState } from "react";
import "./Adminorderplaced.css";
import { Printer, FileDown, Filter, CheckCircle, Clock } from "lucide-react";

export default function Adminorderplaced() {
  const [orders, setOrders] = useState([
    {
      id: "SX-2031",
      customer: "Karthik",
      service: "Color Printing",
      pages: 24,
      total: "Rs 192",
      phone: "+91 98765 43210",
      paperSize: "A4",
      binding: "Spiral",
      copies: 2,
      fileName: "thesis-chapter-2.pdf",
      status: "Completed",
    },
    {
      id: "SX-2032",
      customer: "Divya",
      service: "B/W Xerox",
      pages: 80,
      total: "Rs 80",
      phone: "+91 91234 56789",
      paperSize: "A4",
      binding: "None",
      copies: 1,
      fileName: "assignment-bw.pdf",
      status: "Pending",
    },
    {
      id: "SX-2033",
      customer: "Hari",
      service: "Binding + Print",
      pages: 60,
      total: "Rs 220",
      phone: "+91 97890 12345",
      paperSize: "A3",
      binding: "Calico",
      copies: 3,
      fileName: "project-report.pdf",
      status: "Completed",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );
  };

  const handlePrint = (order) => {
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>Print files</title>
          <style>
            body { font-family: "Segoe UI", sans-serif; margin: 24px; color: #111827; }
            h1 { font-size: 20px; margin-bottom: 8px; }
            p { margin: 6px 0; }
            ul { padding-left: 18px; }
            .meta { color: #6b7280; font-size: 13px; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <h1>Uploaded files</h1>
          <div class="meta">Order ${order.id} • ${order.customer}</div>
          <ul>
            <li>${order.fileName}</li>
          </ul>
          <p><strong>Paper Size:</strong> ${order.paperSize}</p>
          <p><strong>Binding:</strong> ${order.binding}</p>
          <p><strong>Copies:</strong> ${order.copies}</p>
          <p class="meta">Note: Connect file preview/download to print actual documents.</p>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

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
          <button className="admin-orders__ghost">
            <Filter size={16} />
            Filters
          </button>
          <button className="admin-orders__export" onClick={() => window.print()}>
            <FileDown size={16} />
            Export
          </button>
        </div>
      </header>

      <section className="admin-orders__table-card">
        <div className="admin-orders__table-head">
          <p>Latest orders</p>
          <span className="admin-orders__updated">
            Updated just now
            <button
              className="admin-orders__refresh"
              type="button"
              title="Refresh"
              aria-label="Refresh"
            >
              <svg
                className="admin-orders__refresh-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.13-3.36L23 10" />
                <path d="M20.49 15a9 9 0 01-14.13 3.36L1 14" />
              </svg>
            </button>
          </span>
        </div>

        <div className="admin-orders__filters">
          <label>
            Status
            <select>
              <option>All</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </label>
          <label>
            Service
            <select>
              <option>All services</option>
              <option>Color Printing</option>
              <option>B/W Xerox</option>
              <option>Binding</option>
            </select>
          </label>
        </div>

        <div className="admin-orders__table-wrap">
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Pages</th>
                <th>Total</th>
                <th>Phone</th>
                <th>Paper Size</th>
                <th>Binding</th>
                <th>Copies</th>
                <th>File</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isCompleted = order.status === "Completed";
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.service}</td>
                    <td>{order.pages}</td>
                    <td>{order.total}</td>
                    <td>{order.phone}</td>
                    <td>{order.paperSize}</td>
                    <td>{order.binding}</td>
                    <td>{order.copies}</td>
                    <td>
                      <button
                        className="admin-orders__file"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View file
                      </button>
                    </td>
                    <td>
                      <div
                        className={`admin-orders__status-pill ${
                          isCompleted
                            ? "admin-orders__status--completed"
                            : "admin-orders__status--pending"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={14} />
                        ) : (
                          <Clock size={14} />
                        )}
                        <select
                          className="admin-orders__status-select"
                          value={order.status}
                          onChange={(event) =>
                            handleStatusChange(order.id, event.target.value)
                          }
                        >
                          <option>Completed</option>
                          <option>Pending</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <button
                        className="admin-orders__print"
                        onClick={() => setSelectedOrder(order)}
                      >
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
        <div
          className="admin-orders__modal-backdrop"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="admin-orders__modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-orders__modal-header">
              <h2>Print order {selectedOrder.id}</h2>
              <button
                className="admin-orders__modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
            <div className="admin-orders__modal-body">
              <div className="admin-orders__file-card">
                <div>
                  <p className="admin-orders__file-label">Uploaded file</p>
                  <p className="admin-orders__file-name">
                    {selectedOrder.fileName}
                  </p>
                </div>
                <button className="admin-orders__file-preview">
                  Preview
                </button>
              </div>
              <div className="admin-orders__print-options">
                <div>
                  <p className="admin-orders__option-label">Paper size</p>
                  <p>{selectedOrder.paperSize}</p>
                </div>
                <div>
                  <p className="admin-orders__option-label">Binding</p>
                  <p>{selectedOrder.binding}</p>
                </div>
                <div>
                  <p className="admin-orders__option-label">Copies</p>
                  <p>{selectedOrder.copies}</p>
                </div>
              </div>
              <button
                className="admin-orders__print-primary"
                onClick={() => handlePrint(selectedOrder)}
              >
                Send to printer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
