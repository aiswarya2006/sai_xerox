import React, { useState } from "react";
import "./Trackorder.css";
import { PackageSearch, CheckCircle, Clock, Truck } from "lucide-react";

export default function Trackorder() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
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
            <p>Check the status of your print job anytime.</p>
          </div>
        </div>
        <a href="/" className="track-order__back">
          Back to Home
        </a>
      </header>

      <section className="track-order__content">
        <div className="track-order__card">
          <h2>Enter your details</h2>
          <p>We will show the latest status for your order.</p>
          <form className="track-order__form" onSubmit={handleSubmit}>
            <label>
              Order ID
              <input
                type="text"
                placeholder="SX-2031"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                required
              />
            </label>
            <label>
              Phone Number
              <input
                type="tel"
                placeholder="+91 98XXXXXX10"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </label>
            <button type="submit">Track Order</button>
          </form>
        </div>

        <div className="track-order__status">
          <div className="track-order__status-head">
            <h3>Order Status</h3>
            <span>{submitted ? "Updated just now" : "Awaiting input"}</span>
          </div>

          {submitted ? (
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
              <div className="track-order__step track-order__step--done">
                <div className="track-order__icon">
                  <PackageSearch size={18} />
                </div>
                <div>
                  <h4>In production</h4>
                  <p>Printing and binding are in progress.</p>
                </div>
              </div>
              <div className="track-order__step">
                <div className="track-order__icon">
                  <Clock size={18} />
                </div>
                <div>
                  <h4>Ready for pickup</h4>
                  <p>Estimated ready time: 30 minutes.</p>
                </div>
              </div>
              <div className="track-order__step">
                <div className="track-order__icon">
                  <Truck size={18} />
                </div>
                <div>
                  <h4>Delivered</h4>
                  <p>We will notify you once the order is delivered.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="track-order__empty">
              Enter your Order ID and phone number to see updates.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
