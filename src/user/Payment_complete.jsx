import React, { useMemo } from "react";
import { CheckCircle2, Download, Home, ReceiptText } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment_complete.css";

export default function PaymentComplete() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const order = state || {};
  const displayOrder = {
    trackId: order.trackId || "N/A",
    phone: order.phone || "N/A",
    pages: order.pages || 1,
    printType: order.printType || "Black & White",
    copies: order.copies || 1,
    binding: order.binding || "No Binding",
    total: order.total || 0,
  };

  const paymentDate = useMemo(
    () =>
      new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const downloadBill = () => {
    const lines = [
      "SAI XEROX SHOP",
      "",
      `Tracking ID: ${displayOrder.trackId}`,
      "",
      `Phone: ${displayOrder.phone}`,
      `Pages: ${displayOrder.pages}`,
      `Print Type: ${displayOrder.printType}`,
      `Copies: ${displayOrder.copies}`,
      `Binding: ${displayOrder.binding}`,
      `Payment Date: ${paymentDate}`,
      "",
      `Total Paid: Rs. ${displayOrder.total}`,
      "Payment Status: SUCCESS",
      "",
      "Thank you for your order!",
    ];

    const escapePdfText = (text) =>
      text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

    const contentStream = [
      "BT",
      "/F1 18 Tf",
      "50 780 Td",
      `(${escapePdfText(lines[0])}) Tj`,
      "/F1 12 Tf",
      ...lines.slice(1).flatMap((line, index) => [
        index === 0 ? "0 -30 Td" : "0 -20 Td",
        `(${escapePdfText(line)}) Tj`,
      ]),
      "ET",
    ].join("\n");

    const pdfParts = [];
    const offsets = [];
    let position = 0;

    const pushPart = (part) => {
      pdfParts.push(part);
      position += part.length;
    };

    pushPart("%PDF-1.4\n");

    const objects = [
      "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
      "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
      "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
      `4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
      "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    ];

    objects.forEach((object) => {
      offsets.push(position);
      pushPart(object);
    });

    const xrefOffset = position;
    pushPart(`xref\n0 ${objects.length + 1}\n`);
    pushPart("0000000000 65535 f \n");
    offsets.forEach((offset) => {
      pushPart(`${offset.toString().padStart(10, "0")} 00000 n \n`);
    });
    pushPart(
      `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
    );

    const blob = new Blob(pdfParts, { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${displayOrder.trackId}-invoice.pdf`;
    link.click();
  };

  return (
    <div className="payment-complete-page">
      <header className="payment-complete-topbar">
        <div className="payment-complete-topbar__inner">
          <a href="/" className="payment-complete-brand">
            <div className="payment-complete-brand__logo">
              <ReceiptText size={24} />
            </div>
            <div>
              <h1 className="payment-complete-brand__title">Sai Xerox Shop</h1>
              <p className="payment-complete-brand__subtitle">Place Your Order</p>
            </div>
          </a>

          <a href="/" className="payment-complete-back">{"\u2190"} Back to Home</a>
        </div>
      </header>

      <div className="payment-complete-shell">
        <div className="payment-complete-steps">
          <div className="payment-complete-steps__row">
            <div className="payment-complete-step">
              <div className="payment-complete-step__circle payment-complete-step__circle--done">1</div>
              <span className="payment-complete-step__label payment-complete-step__label--done">Upload</span>
            </div>

            <div className="payment-complete-step__line payment-complete-step__line--done"></div>

            <div className="payment-complete-step">
              <div className="payment-complete-step__circle payment-complete-step__circle--done">2</div>
              <span className="payment-complete-step__label payment-complete-step__label--done">Payment</span>
            </div>

            <div className="payment-complete-step__line payment-complete-step__line--done"></div>

            <div className="payment-complete-step">
              <div className="payment-complete-step__circle payment-complete-step__circle--active">3</div>
              <span className="payment-complete-step__label payment-complete-step__label--active">Complete</span>
            </div>
          </div>
        </div>

        <main className="payment-complete-card">
          <section className="payment-complete-hero">
            <div className="payment-complete-hero__icon-wrap">
              <div className="payment-complete-hero__icon">
                <CheckCircle2 size={72} />
              </div>
            </div>

            <h2 className="payment-complete-hero__title">Payment Successful</h2>
            <p className="payment-complete-hero__text">
              Your Xerox order has been confirmed and is now queued for processing.
            </p>
          </section>

          <section className="payment-complete-content">
            <div className="payment-complete-track">
              <p className="payment-complete-track__label">Tracking ID</p>
              <h3 className="payment-complete-track__value">{order.trackId}</h3>
            </div>

            <div className="payment-complete-invoice">
              <div className="payment-complete-invoice__head">
                <h3>Payment Invoice</h3>
                <span className="payment-complete-invoice__status">Paid</span>
              </div>

              <div className="payment-complete-invoice__rows">
                <div className="payment-complete-invoice__row">
                  <span>Phone Number</span>
                  <strong>{displayOrder.phone}</strong>
                </div>

                <div className="payment-complete-invoice__row">
                  <span>Pages</span>
                  <strong>{displayOrder.pages}</strong>
                </div>

                <div className="payment-complete-invoice__row">
                  <span>Print Type</span>
                  <strong>{displayOrder.printType}</strong>
                </div>

                <div className="payment-complete-invoice__row">
                  <span>Copies</span>
                  <strong>{displayOrder.copies}</strong>
                </div>

                <div className="payment-complete-invoice__row">
                  <span>Binding</span>
                  <strong>{displayOrder.binding}</strong>
                </div>

                <div className="payment-complete-invoice__row">
                  <span>Payment Date</span>
                  <strong>{paymentDate}</strong>
                </div>

                <hr className="payment-complete-invoice__divider" />

                <div className="payment-complete-invoice__total">
                  <span>Total Paid</span>
                  <strong>{"\u20B9"}{displayOrder.total}</strong>
                </div>
              </div>
            </div>

            <div className="payment-complete-actions">
              <button
                onClick={downloadBill}
                className="payment-complete-actions__button payment-complete-actions__button--primary"
              >
                <Download size={20} />
                Download Bill
              </button>

              <button
                onClick={() => navigate("/")}
                className="payment-complete-actions__button payment-complete-actions__button--secondary"
              >
                <Home size={20} />
                Back Home
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
