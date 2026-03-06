import React, { useState } from "react";
import "./Adminlogin.css";
import { ShieldCheck, ArrowRight, Printer, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/admin/orders");
        return;
      }

      setError(data.message || "Invalid username or password");
    } catch (fetchError) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <form className="admin-login__form" onSubmit={handleLogin}>
            <label>
              Username
              <input
                type="text"
                placeholder="admin"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </label>
            <label>
              Password
              <div className="admin-login__password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="admin-login__password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && <p className="admin-login__error">{error}</p>}
            <button type="submit" className="admin-login__submit">
              {isSubmitting ? "Logging in..." : "Login"}
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
