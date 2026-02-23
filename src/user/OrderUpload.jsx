import React, { useState } from 'react';
import './OrderUpload.css';
import { Upload, FileText, Image, CheckCircle, ArrowRight, X } from 'lucide-react';
import { submitOrder } from '../api/orderApi'; // adjust path if needed

export default function OrderUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    contentType: 'pdf',
    printType: 'color',
    copies: 1,
    paperSize: 'A4',
    binding: 'none',
    description: ''
  });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phone: digitsOnly
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'copies' ? Math.max(1, Number(value)) : value
    }));
  };

  const isFormValid = () => {
    if (uploadedFiles.length === 0) return false;
    if (!/^\d{10}$/.test(formData.phone)) return false;
    if (!formData.contentType) return false;
    if (!formData.printType) return false;
    if (!formData.copies || Number(formData.copies) < 1) return false;
    if (!formData.paperSize) return false;
    if (!formData.binding) return false;
    return true;
  };

  const calculatePrice = () => {
    const basePrice = formData.printType === 'color' ? 8 : 1;
    const bindingPrice =
      formData.binding === 'spiral'
        ? 30
        : formData.binding === 'calico'
        ? 25
        : formData.binding === 'hole'
        ? 5
        : 0;
    const total = basePrice * formData.copies * uploadedFiles.length + bindingPrice;
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    setErrorMessage('');

    if (!isFormValid()) return;

    setIsLoading(true);

    try {
      const response = await submitOrder(formData, uploadedFiles);

      // On success → go to payment page with order details
      window.location.href = `/payment?orderId=${response.orderId}&total=${response.totalPrice}`;
    } catch (error) {
      if (error.response) {
        // Server responded with error (4xx, 5xx)
        setErrorMessage(error.response.data.error || 'Server error. Please try again.');
      } else if (error.request) {
        // No response — Spring Boot not running
        setErrorMessage('Cannot connect to server. Make sure Spring Boot is running on port 8080.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ou-page">
      <header className="ou-header">
        <div className="ou-container ou-header-inner">
          
          <a href="/" className="ou-brand">
            <div className="ou-logo">
              <FileText className="ou-logo-icon" size={24} />
            </div>
            <div>
              <h1 className="ou-title">Sai Xerox Shop</h1>
              <p className="ou-subtitle">Place Your Order</p>
            </div>
          </a>
          <a href="/" className="ou-back">
            ← Back to Home
          </a>
        </div>
      </header>

      <div className="ou-container ou-content">
        <div className="ou-steps">
          <div className="ou-steps-row">
            <div className="ou-step">
              <div className="ou-step-circle ou-step-circle--active">1</div>
              <span className="ou-step-label">Upload</span>
            </div>
            <div className="ou-step-line"></div>
            <div className="ou-step">
              <div className="ou-step-circle">2</div>
              <span className="ou-step-label ou-step-label--muted">Payment</span>
            </div>
            <div className="ou-step-line"></div>
            <div className="ou-step">
              <div className="ou-step-circle">3</div>
              <span className="ou-step-label ou-step-label--muted">Complete</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ou-form">
          <div className="ou-card">
            <h2 className="ou-card-title">Upload Documents</h2>

            <div className="ou-section">
              <label className="ou-label">
                Phone Number <span className="ou-required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                inputMode="numeric"
                pattern="\d{10}"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className="ou-input"
                required
              />
            </div>

            <div className="ou-upload">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                required
                className="ou-upload-input"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload" className="ou-upload-label">
                <Upload className="ou-upload-icon" size={48} />
                <p className="ou-upload-title">Click to upload or drag and drop</p>
                <p className="ou-upload-text">PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)</p>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="ou-file-list">
                <h3 className="ou-file-title">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="ou-file-item">
                    <div className="ou-file-info">
                      <FileText className="ou-file-icon" size={24} />
                      <div>
                        <p className="ou-file-name">{file.name}</p>
                        <p className="ou-file-size">{file.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ou-file-remove"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="ou-section">
              <label className="ou-label">
                Content Type <span className="ou-required">*</span>
              </label>
              <div className="ou-grid-2">
                <button
                  type="button"
                  
                  onClick={() => setFormData({ ...formData, contentType: 'pdf' })}
                  className={`ou-option ${formData.contentType === 'pdf' ? 'ou-option--active' : ''}`}
                >
                  <FileText
                    className={`ou-option-icon ${
                      formData.contentType === 'pdf' ? 'ou-option-icon--active' : ''
                    }`}
                    size={24}
                  />
                  <p className="ou-option-text">PDF / Document</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, contentType: 'image' })}
                  className={`ou-option ${formData.contentType === 'image' ? 'ou-option--active' : ''}`}
                >
                  <Image
                    className={`ou-option-icon ${
                      formData.contentType === 'image' ? 'ou-option-icon--active' : ''
                    }`}
                    size={24}
                  />
                  <p className="ou-option-text">Image / Photo</p>
                </button>
              </div>
            </div>
          </div>

          <div className="ou-card">
            <h2 className="ou-card-title">Print Options</h2>

            <div className="ou-section">
              <label className="ou-label">
                Print Type <span className="ou-required">*</span>
              </label>
              <div className="ou-grid-2">
                <label className={`ou-option ou-option--radio ${formData.printType === 'color' ? 'ou-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="printType"
                    value="color"
                    checked={formData.printType === 'color'}
                    onChange={handleInputChange}
                    className="ou-hidden"
                    required
                  />
                  <div className="ou-option-row">
                    <div>
                      <p className="ou-option-title">Color</p>
                      <p className="ou-option-sub">₹8 per page</p>
                    </div>
                    {formData.printType === 'color' && <CheckCircle className="ou-check" size={24} />}
                  </div>
                </label>

                <label className={`ou-option ou-option--radio ${formData.printType === 'bw' ? 'ou-option--active' : ''}`}>
                  <input
                    type="radio"
                    name="printType"
                    value="bw"
                    checked={formData.printType === 'bw'}
                    onChange={handleInputChange}
                    className="ou-hidden"
                    required
                  />
                  <div className="ou-option-row">
                    <div>
                      <p className="ou-option-title">Black & White</p>
                      <p className="ou-option-sub">₹1 per page</p>
                    </div>
                    {formData.printType === 'bw' && <CheckCircle className="ou-check" size={24} />}
                  </div>
                </label>
              </div>
            </div>

            {/* <div className="ou-section">
              <label className="ou-label">Number of Copies</label>
              <div className="ou-copies">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, copies: Math.max(1, formData.copies - 1) })}
                  className="ou-copies-btn"
                >
                  −
                </button>
                <input
                  type="number"
                  name="copies"
                  value={formData.copies}
                  onChange={handleInputChange}
                  min="1"
                  className="ou-copies-input"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, copies: formData.copies + 1 })}
                  className="ou-copies-btn"
                >
                  +
                </button>
              </div>
            </div> */}
            <div className="ou-section">
  <label className="ou-label">
    Number of Copies <span className="ou-required">*</span>
  </label>

  <div className="ou-copies">
    {/* Decrease */}
    <button
      type="button"
      className="ou-copies-btn"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          copies: Math.max(1, Number(prev.copies) - 1)
        }))
      }
    >
      −
    </button>

    {/* Input */}
    <input
      type="number"
      name="copies"
      min="1"
      value={formData.copies}
      onChange={handleInputChange}
      className="ou-copies-input"
      required
    />

    {/* Increase */}
    <button
      type="button"
      className="ou-copies-btn"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          copies: Number(prev.copies) + 1
        }))
      }
    >
      +
    </button>
  </div>
</div>

            <div className="ou-section">
              <label className="ou-label">
                Paper Size <span className="ou-required">*</span>
              </label>
              <div className="ou-grid-2">
                {['A4', 'A3'].map((size) => (
                  <label key={size} className={`ou-option ou-option--radio ${formData.paperSize === size ? 'ou-option--active' : ''}`}>
                    <input
                      type="radio"
                      name="paperSize"
                      value={size}
                      checked={formData.paperSize === size}
                      onChange={handleInputChange}
                      className="ou-hidden"
                      required
                    />
                    <div className="ou-option-row">
                      <p className="ou-option-title">{size}</p>
                      {formData.paperSize === size && <CheckCircle className="ou-check" size={24} />}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="ou-section">
              <label className="ou-label">
                Binding <span className="ou-required">*</span>
              </label>
              <div className="ou-grid-2">
                {[
                  { value: 'none', label: 'No Binding', price: '₹0' },
                  { value: 'spiral', label: 'Spiral', price: '₹30' },
                  { value: 'calico', label: 'Calico', price: '₹25' },
                  { value: 'hole', label: 'Hole Punch', price: '₹5' }
                ].map((option) => (
                  <label key={option.value} className={`ou-option ou-option--radio ${formData.binding === option.value ? 'ou-option--active' : ''}`}>
                    <input
                      type="radio"
                      name="binding"
                      value={option.value}
                      checked={formData.binding === option.value}
                      onChange={handleInputChange}
                      className="ou-hidden"
                      required
                    />
                    <div className="ou-option-row">
                      <div>
                        <p className="ou-option-title">{option.label}</p>
                        <p className="ou-option-sub">{option.price}</p>
                      </div>
                      {formData.binding === option.value && <CheckCircle className="ou-check" size={24} />}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="ou-section">
              <label className="ou-label">Additional Instructions (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Any special requirements or instructions..."
                className="ou-textarea"
              ></textarea>
            </div>
          </div>

          <div className="ou-summary">
            <h2 className="ou-summary-title">Order Summary</h2>
            <div className="ou-summary-list">
              <div className="ou-summary-row">
                <span>Documents:</span>
                <span className="ou-summary-value">{uploadedFiles.length} files</span>
              </div>
              <div className="ou-summary-row">
                <span>Print Type:</span>
                <span className="ou-summary-value">
                  {formData.printType === 'color' ? 'Color' : 'Black & White'}
                </span>
              </div>
              <div className="ou-summary-row">
                <span>Copies:</span>
                <span className="ou-summary-value">{formData.copies}</span>
              </div>
              <div className="ou-summary-row">
                <span>Paper Size:</span>
                <span className="ou-summary-value">{formData.paperSize}</span>
              </div>
              <div className="ou-summary-row">
                <span>Binding:</span>
                <span className="ou-summary-value">
                  {formData.binding === 'none'
                    ? 'No Binding'
                    : formData.binding === 'spiral'
                    ? 'Spiral'
                    : formData.binding === 'calico'
                    ? 'Calico'
                    : 'Hole Punch'}
                </span>
              </div>
              <div className="ou-summary-total">
                <span>Total:</span>
                <span>₹{calculatePrice()}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="ou-summary-cta"
            >
              {isLoading ? 'Submitting...' : 'Proceed to Payment'}
              {!isLoading && <ArrowRight size={24} />}
            </button>

            {/* Show backend error */}
            {errorMessage && (
              <p className="ou-summary-error">{errorMessage}</p>
            )}

            {/* Show validation error */}
            {attemptedSubmit && !isFormValid() && !errorMessage && (
              <p className="ou-summary-error">Please upload files and complete all required fields.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
