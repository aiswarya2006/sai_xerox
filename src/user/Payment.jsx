import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Wallet,
  FileText,
  CheckCircle2,
} from "lucide-react";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedPayment, setSelectedPayment] = useState("upi");

  const order = {
    trackId: state?.trackId ?? state?.trackingId ?? "N/A",
    documents: state?.documents || 1,
    pages: state?.pages || 1,
    printType: state?.printType || "Black & White",
    copies: state?.copies || 1,
    binding: state?.binding || "No Binding",
    totalPrice: state?.total ?? state?.totalPrice ?? 0,
    phone: state?.phone || "",
    orderId: state?.orderId || null,
  };

  const paymentMethods = [
    {
      id: "upi",
      title: "UPI Payment",
      subtitle: "Pay using GPay, PhonePe, Paytm",
      icon: <Smartphone size={22} />,
    },
    {
      id: "card",
      title: "Credit / Debit Card",
      subtitle: "Visa, MasterCard, RuPay",
      icon: <CreditCard size={22} />,
    },
    {
      id: "cash",
      title: "Cash on Delivery",
      subtitle: "Pay while collecting prints",
      icon: <Wallet size={22} />,
    },
  ];

  return (
    <div className="payment-page">
      <header className="payment-topbar">
        <div className="payment-topbar__inner">
          <a href="/" className="payment-brand">
            <div className="payment-brand__logo">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="payment-brand__title">Sai Xerox Shop</h1>
              <p className="payment-brand__subtitle">Place Your Order</p>
            </div>
          </a>

          <a href="/" className="payment-back">{"\u2190"} Back to Home</a>
        </div>
      </header>

      <div className="payment-shell">
        <div className="payment-steps">
          <div className="payment-steps__row">
            <div className="payment-step">
              <div className="payment-step__circle payment-step__circle--done">1</div>
              <span className="payment-step__label payment-step__label--done">Upload</span>
            </div>

            <div className="payment-step__line payment-step__line--done"></div>

            <div className="payment-step">
              <div className="payment-step__circle payment-step__circle--active">2</div>
              <span className="payment-step__label payment-step__label--active">Payment</span>
            </div>

            <div className="payment-step__line"></div>

            <div className="payment-step">
              <div className="payment-step__circle">3</div>
              <span className="payment-step__label">Complete</span>
            </div>
          </div>
        </div>

        <div className="payment-layout">
          <div className="payment-card payment-card--light">
            <div className="payment-header">
              <div className="payment-badge">
                <FileText size={28} />
              </div>

              <h1 className="payment-title">Secure Payment</h1>
              <p className="payment-subtitle">
                Complete your Xerox order safely and securely.
              </p>
            </div>

            <div>
              <h2 className="payment-section-title">Choose Payment Method</h2>

              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`payment-method ${
                      selectedPayment === method.id ? "payment-method--active" : ""
                    }`}
                  >
                    <div className="payment-method__content">
                      <div
                        className={`payment-method__icon ${
                          selectedPayment === method.id
                            ? "payment-method__icon--active"
                            : ""
                        }`}
                      >
                        {method.icon}
                      </div>

                      <div>
                        <h3 className="payment-method__title">{method.title}</h3>
                        <p className="payment-method__subtitle">{method.subtitle}</p>
                      </div>
                    </div>

                    {selectedPayment === method.id && (
                      <CheckCircle2 className="payment-method__check" size={24} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="payment-security">
              <CheckCircle2 className="payment-security__icon" size={22} />

              <div>
                <p className="payment-security__title">100% Secure Payment</p>
                <p className="payment-security__text">
                  Your payment information is encrypted and protected.
                </p>
              </div>
            </div>
          </div>

          <div className="payment-card payment-card--summary">
            <div className="payment-summary__glow"></div>

            <div className="payment-summary__content">
              <h2 className="payment-summary__title">Order Summary</h2>
              <p className="payment-summary__subtitle">
                Review your order before payment
              </p>

              <div className="payment-summary__panel">
                <div className="payment-summary__rows">
                  <div className="payment-summary__row">
                    <span className="payment-summary__label">Documents</span>
                    <span className="payment-summary__value">{order.documents} File{order.documents > 1 ? "s" : ""}</span>
                  </div>

                  <div className="payment-summary__row">
                    <span className="payment-summary__label">Pages</span>
                    <span className="payment-summary__value">{order.pages}</span>
                  </div>

                  <div className="payment-summary__row">
                    <span className="payment-summary__label">Print Type</span>
                    <span className="payment-summary__value">{order.printType}</span>
                  </div>

                  <div className="payment-summary__row">
                    <span className="payment-summary__label">Copies</span>
                    <span className="payment-summary__value">{order.copies}</span>
                  </div>

                  <div className="payment-summary__row">
                    <span className="payment-summary__label">Binding</span>
                    <span className="payment-summary__value">{order.binding}</span>
                  </div>

                  <hr className="payment-summary__divider" />

                  <div className="payment-summary__total">
                    <span className="payment-summary__total-label">Total Amount</span>
                    <span className="payment-summary__total-value">{"\u20B9"}{order.totalPrice}</span>
                  </div>
                </div>
              </div>

              <button
                className="payment-summary__button"
                onClick={() =>
                  navigate("/payment-complete", {
                    state: {
                      trackId: order.trackId,
                      phone: order.phone,
                      pages: order.pages,
                      printType: order.printType,
                      copies: order.copies,
                      binding: order.binding,
                      total: order.totalPrice,
                    },
                  })
                }
              >
                Proceed to Pay
              </button>

              <p className="payment-summary__footer">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
