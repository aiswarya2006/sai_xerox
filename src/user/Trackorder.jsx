import React, { useState } from "react";
import "./Trackorder.css";
import {
  CheckCircle,
  Clock,
  FileText,
  IndianRupee,
  PackageSearch,
  Printer,
  Truck,
} from "lucide-react";
import { getOrderByTrackingId } from "../api/orderApi";

function formatDate(value) {
  if (!value) return "Not available";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatFileName(fileNames) {
  const file = fileNames?.split(",")[0]?.trim();
  if (!file) return "Not available";

  return file.includes("_") ? file.substring(file.indexOf("_") + 1) : file;
}

function isStepDone(orderStatus, step) {
  const status = String(orderStatus || "").toUpperCase();
  const rank = {
    PENDING: 2,
    COMPLETED: 3,
    DELIVERED: 4,
  };

  return (rank[status] || 1) >= step;
}

export default function Trackorder() {
  const [trackingId, setTrackingId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanTrackingId = trackingId.trim().toUpperCase();
    if (!cleanTrackingId) return;

    setError("");
    setOrder(null);
    setSubmitted(false);
    setIsLoading(true);

    try {
      const data = await getOrderByTrackingId(cleanTrackingId);
      setOrder(data);
      setSubmitted(true);
    } catch (err) {
      setError("No order found for this Tracking ID. Please check and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="track-order">
      <header className="track-order__header">
        <div className="track-order__brand">
          <div className="track-order__logo">
            <PackageSearch size={22} />
          </div>
          <div>
            <h1>Track Your Order</h1>
            <p>Enter your Tracking ID to check your print job status.</p>
          </div>
        </div>

        <a href="/" className="track-order__back">
          Back to Home
        </a>
      </header>

      <section className="track-order__content">
        <div className="track-order__card">
          <h2>Enter Tracking ID</h2>
          <p>Use the ID shown after payment, for example SX98187.</p>

          <form className="track-order__form" onSubmit={handleSubmit}>
            <label>
              Tracking ID
              <input
                type="text"
                placeholder="SX98187"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                required
              />
            </label>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Track Order"}
            </button>
          </form>

          {error && <p className="track-order__error">{error}</p>}
        </div>

        <div className="track-order__status">
          <div className="track-order__status-head">
            <h3>Order Status</h3>
            <span>{submitted ? "Updated just now" : "Awaiting Tracking ID"}</span>
          </div>

          {order ? (
            <div>
              <div className="track-order__summary">
                <div>
                  <span>Tracking ID</span>
                  <strong>{order.trackId || order.trackingId || trackingId}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{order.status || "Not available"}</strong>
                </div>
              </div>

              <div className="track-order__timeline">
                <div className="track-order__step track-order__step--done">
                  <div className="track-order__icon">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <h4>Order received</h4>
                    <p>We have received your files and order details.</p>
                  </div>
                </div>

                <div
                  className={`track-order__step ${
                    isStepDone(order.status, 2) ? "track-order__step--done" : ""
                  }`}
                >
                  <div className="track-order__icon">
                    <Printer size={18} />
                  </div>
                  <div>
                    <h4>In production</h4>
                    <p>Printing and binding are in progress.</p>
                  </div>
                </div>

                <div
                  className={`track-order__step ${
                    isStepDone(order.status, 3) ? "track-order__step--done" : ""
                  }`}
                >
                  <div className="track-order__icon">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4>Ready for pickup</h4>
                    <p>Your order is ready after completion.</p>
                  </div>
                </div>

                <div
                  className={`track-order__step ${
                    isStepDone(order.status, 4) ? "track-order__step--done" : ""
                  }`}
                >
                  <div className="track-order__icon">
                    <Truck size={18} />
                  </div>
                  <div>
                    <h4>Delivered</h4>
                    <p>Order delivered successfully.</p>
                  </div>
                </div>
              </div>

              <div className="track-order__details">
                <h4>Order Details</h4>

                <div className="track-order__detail-grid">
                  <div>
                    <FileText size={18} />
                    <span>File Name</span>
                    <strong>{formatFileName(order.fileNames)}</strong>
                  </div>
                  <div>
                    <Printer size={18} />
                    <span>Print Type</span>
                    <strong>{order.printType || "Not available"}</strong>
                  </div>
                  <div>
                    <PackageSearch size={18} />
                    <span>Copies</span>
                    <strong>{order.copies ?? "Not available"}</strong>
                  </div>
                  <div>
                    <IndianRupee size={18} />
                    <span>Amount</span>
                    <strong>₹{order.totalPrice ?? order.amount ?? "0"}</strong>
                  </div>
                  <div className="track-order__detail-wide">
                    <Clock size={18} />
                    <span>Submitted Date</span>
                    <strong>{formatDate(order.createdAt || order.submittedAt)}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="track-order__empty">
              Enter your Tracking ID to see status, file name, print type, copies,
              amount, and submitted date.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
