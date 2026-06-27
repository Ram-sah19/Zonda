import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">

          {/* Company */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h3 className="fw-bold text-warning">ZONDA</h3>
            <p className="mt-3">
              Your one-stop destination for the latest electronics,
              fashion, accessories, and everyday essentials at the best prices.
            </p>

            <div className="mt-4">
              <a href="/" className="text-light me-3 fs-4">
                <i className="bi bi-facebook"></i>
              </a>

              <a href="/" className="text-light me-3 fs-4">
                <i className="bi bi-instagram"></i>
              </a>

              <a href="/" className="text-light me-3 fs-4">
                <i className="bi bi-twitter-x"></i>
              </a>

              <a href="/" className="text-light fs-4">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold">Quick Links</h5>

            <ul className="list-unstyled mt-3">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/products" className="text-light text-decoration-none">Products</a></li>
              <li><a href="/categories" className="text-light text-decoration-none">Categories</a></li>
              <li><a href="/deals" className="text-light text-decoration-none">Deals</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold">Customer Support</h5>

            <ul className="list-unstyled mt-3">
              <li><a href="/" className="text-light text-decoration-none">Help Center</a></li>
              <li><a href="/" className="text-light text-decoration-none">Track Order</a></li>
              <li><a href="/" className="text-light text-decoration-none">Return Policy</a></li>
              <li><a href="/" className="text-light text-decoration-none">Privacy Policy</a></li>
              <li><a href="/" className="text-light text-decoration-none">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold">Contact Us</h5>

            <p className="mt-3">
              <i className="bi bi-geo-alt-fill me-2"></i>
              Bangalore, Karnataka
            </p>

            <p>
              <i className="bi bi-envelope-fill me-2"></i>
              support@zonda.com
            </p>

            <p>
              <i className="bi bi-telephone-fill me-2"></i>
              +91 98765 43210
            </p>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center">
          <p className="mb-0">
            © {new Date().getFullYear()} <strong>ZONDA</strong>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;