import React from "react";
import "./Adminlogin.css";
import { ShieldCheck, ArrowRight, Printer } from "lucide-react";

export default function AdminLogin() {
  return (
    <div className="admin-login">
      <header className="admin-login__header">
        <div className="admin-login__brand">
          <div className="admin-login__logo">
            <Printer size={22} />
          </div>
          <div>
            <h1 className="admin-login__title">Sai Xerox Admin</h1>
            <p className="admin-login__subtitle">Secure access for staff only</p>
          </div>
        </div>
        <a href="/" className="admin-login__back">
          Back to Site
        </a>
      </header>

      <main className="admin-login__main">
        <section className="admin-login__welcome">
          <div className="admin-login__badge">
            <ShieldCheck size={16} />
            Admin Portal
          </div>
          <h2>Manage orders with confidence.</h2>
          <p>
            Track uploads, update order status, and keep customers informed in
            real time.
          </p>
          <div className="admin-login__stats">
            <div className="admin-login__stat">
              <h3>120+</h3>
              <p>Weekly Orders</p>
            </div>
            <div className="admin-login__stat">
              <h3>15 min</h3>
              <p>Average Turnaround</p>
            </div>
          </div>
        </section>

        <section className="admin-login__card">
          <h3>Sign in</h3>
          <p>Use your admin credentials to continue.</p>
          <form
            className="admin-login__form"
            onSubmit={(event) => {
              event.preventDefault();
              window.location.href = "/admin/orders";
            }}
          >
            <label>
              Username
              <input type="text" placeholder="admin" required />
            </label>
            <label>
              Password
              <input type="password" placeholder="Enter your password" required />
            </label>
            <button type="submit">
              Login
              <ArrowRight size={18} />
            </button>
          </form>
          <div className="admin-login__hint">
            Need access? Contact the store manager.
          </div>
        </section>
      </main>
    </div>
  );
}
