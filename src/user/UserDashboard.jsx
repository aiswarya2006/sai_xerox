import React from 'react';
import './UserDashboard.css';
import { Printer, Upload, Clock, CheckCircle, ArrowRight, Star } from 'lucide-react';

export default function UserDashboard() {
  const services = [
    {
      icon: Printer,
      title: 'Photocopying',
      description: 'High-quality black & white and color copies',
      price: 'From ₹1/page'
    },
    {
      icon: Upload,
      title: 'Document Printing',
      description: 'Print your PDFs and documents instantly',
      price: 'From ₹2/page'
    },
    {
      icon: CheckCircle,
      title: 'Binding Services',
      description: 'Spiral, calico, and hole punch binding',
      price: 'From ₹20'
    },
    {
      icon: Clock,
      title: 'Quick Turnaround',
      description: 'Same-day service for urgent orders',
      price: 'Express available'
    }
  ];

  const features = [
    'High-Speed Printing',
    'Color & B/W Options',
    'Multiple Paper Sizes',
    'Professional Binding',
    'Affordable Pricing',
    'Online Upload'
  ];

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="ud-header">
        <div className="container ud-header-inner">
          <div className="ud-brand">
            <div className="ud-logo">
              <Printer className="ud-logo-icon" size={24} />
            </div>
            <div>
              <h1 className="ud-brand-title">Sai Xerox Shop</h1>
              <p className="ud-brand-subtitle">Quality Printing & Copying Services</p>
            </div>
          </div>
          <nav className="ud-nav">
            <a href="#services" className="ud-nav-link">Services</a>
            <a href="#pricing" className="ud-nav-link">Pricing</a>
            <a href="#contact" className="ud-nav-link">Contact</a>
             <a href="#track_Order" className="ud-nav-link">Track Order</a>
            <a href="/login" className="ud-nav-cta">Admin Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="ud-hero">
        <div className="container ud-hero-grid">
          <div className="ud-hero-content">
            <div className="ud-hero-badge">
              <Star size={16} fill="currentColor" />
              Trusted by 1000+ Customers
            </div>
            <h2 className="ud-hero-title">
              Professional Printing & Xerox Services
            </h2>
            <p className="ud-hero-text">
              Fast, reliable, and affordable photocopying and printing services. Upload your documents online or visit our shop.
            </p>
            <div className="ud-hero-actions">
              <a href="/order" className="ud-btn ud-btn-primary">
                Upload & Print
                <ArrowRight size={20} />
              </a>
              <a href="#pricing" className="ud-btn ud-btn-secondary">
                View Pricing
              </a>
            </div>
          </div>
          <div className="ud-hero-media">
            <div className="ud-hero-card">
              <img
                src="https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=600&h=400&fit=crop"
                alt="Xerox machine"
                className="ud-hero-image"
              />
            </div>
            <div className="ud-hero-stat">
              <div className="ud-hero-stat-icon">
                <CheckCircle className="ud-hero-stat-check" size={28} />
              </div>
              <div>
                <p className="ud-hero-stat-value">1000+</p>
                <p className="ud-hero-stat-label">Orders Completed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="ud-section ud-services">
        <div className="container">
          <div className="ud-section-head">
            <h3 className="ud-section-title">Our Services</h3>
            <p className="ud-section-subtitle">Everything you need for your printing and copying requirements</p>
          </div>
          <div className="ud-services-grid">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="ud-service-card">
                  <div className="ud-service-icon">
                    <Icon className="ud-service-icon-svg" size={28} />
                  </div>
                  <h4 className="ud-service-title">{service.title}</h4>
                  <p className="ud-service-text">{service.description}</p>
                  <p className="ud-service-price">{service.price}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="ud-features">
        <div className="container ud-features-grid">
          <div>
            <h3 className="ud-features-title">Why Choose Sai Xerox?</h3>
            <p className="ud-features-text">
              We provide the best quality printing and xerox services with modern equipment and experienced staff.
            </p>
            <div className="ud-features-list">
              {features.map((feature, index) => (
                <div key={index} className="ud-feature-item">
                  <CheckCircle size={20} className="ud-feature-check" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ud-features-card">
            <h4 className="ud-features-card-title">Quick Upload</h4>
            <p className="ud-features-card-text">
              Upload your documents online and collect them from our shop or get them delivered.
            </p>
            <a href="/order" className="ud-btn ud-btn-light">
              Start Now
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="ud-section ud-pricing">
        <div className="container">
          <div className="ud-section-head">
            <h3 className="ud-section-title">Affordable Pricing</h3>
            <p className="ud-section-subtitle">Transparent and competitive rates for all services</p>
          </div>
          <div className="ud-pricing-grid">
            <div className="ud-pricing-card">
              <h4 className="ud-pricing-title">Black & White</h4>
              <div className="ud-pricing-price">
                <span className="ud-pricing-value">₹1</span>
                <span className="ud-pricing-suffix">/page</span>
              </div>
              <ul className="ud-pricing-list">
                <li className="ud-pricing-item">
                  <CheckCircle size={20} className="ud-pricing-check" />
                  <span>A4 Size</span>
                </li>
                <li className="ud-pricing-item">
                  <CheckCircle size={20} className="ud-pricing-check" />
                  <span>Single Side</span>
                </li>
                <li className="ud-pricing-item">
                  <CheckCircle size={20} className="ud-pricing-check" />
                  <span>Standard Quality</span>
                </li>
              </ul>
              <a href="/order" className="ud-pricing-cta">
                Order Now
              </a>
            </div>

            <div className="ud-pricing-card ud-pricing-card--featured">
              <div className="ud-pricing-badge">Most Popular</div>
              <h4 className="ud-pricing-title">Color</h4>
              <div className="ud-pricing-price">
                <span className="ud-pricing-value">₹8</span>
                <span className="ud-pricing-suffix">/page</span>
              </div>
              <ul className="ud-pricing-list">
                <li className="ud-pricing-item">
                  <CheckCircle size={20} className="ud-pricing-check" />
                  <span>A4 Size</span>
                </li>
                <li className="ud-pricing-item">
                  <CheckCircle size={20} className="ud-pricing-check" />
                  <span>Single/Double Side</span>
                </li>
                <li className="ud-pricing-item">
                  <CheckCircle size={20} className="ud-pricing-check" />
                  <span>Premium Quality</span>
                </li>
              </ul>
              <a href="/order" className="ud-pricing-cta ud-pricing-cta--light">
                Order Now
              </a>
            </div>

            <div className="ud-pricing-card">
              <h4 className="ud-pricing-title">Binding</h4>
              <div className="ud-pricing-price">
                <span className="ud-pricing-value">₹20</span>
                <span className="ud-pricing-suffix">+</span>
              </div>
              <ul className="ud-pricing-list">
                <li className="ud-pricing-item">
                  <CheckCircle size={20} className="ud-pricing-check" />
                  <span>Spiral Binding</span>
                </li>
                <li className="ud-pricing-item">
                  <CheckCircle size={20} className="ud-pricing-check" />
                  <span>Calico Binding</span>
                </li>
                <li className="ud-pricing-item">
                  <CheckCircle size={20} className="ud-pricing-check" />
                  <span>Hole Punch</span>
                </li>
              </ul>
              <a href="/order" className="ud-pricing-cta">
                Order Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="ud-section ud-contact">
        <div className="container">
          <div className="ud-contact-card">
            <div className="ud-contact-grid">
              <div>
                <h3 className="ud-contact-title">Visit Our Shop</h3>
                <p className="ud-contact-text">
                  Come visit us for all your printing and copying needs. We're here to help!
                </p>
                <div className="ud-contact-info">
                  <div>
                    <h5 className="ud-contact-label">Address</h5>
                    <p className="ud-contact-value">Salem, Tamil Nadu, India</p>
                  </div>
                  <div>
                    <h5 className="ud-contact-label">Hours</h5>
                    <p className="ud-contact-value">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                    <p className="ud-contact-value">Sunday: Closed</p>
                  </div>
                  <div>
                    <h5 className="ud-contact-label">Contact</h5>
                    <p className="ud-contact-value">Phone: +91 XXXXXXXXXX</p>
                    <p className="ud-contact-value">Email: contact@saixerox.com</p>
                  </div>
                </div>
              </div>
              <div className="ud-contact-form-wrap">
                <h4 className="ud-contact-form-title">Send us a message</h4>
                <form className="ud-contact-form">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="ud-input"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="ud-input"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    className="ud-textarea"
                  ></textarea>
                  <button className="ud-submit">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ud-footer">
        <div className="container ud-footer-inner">
          <div className="ud-footer-brand">
            <div className="ud-logo ud-logo--small">
              <Printer className="ud-logo-icon" size={20} />
            </div>
            <h4 className="ud-footer-title">Sai Xerox Shop</h4>
          </div>
          <p className="ud-footer-text">Quality Printing & Copying Services Since 2020</p>
          <p className="ud-footer-note">© 2026 Sai Xerox Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
