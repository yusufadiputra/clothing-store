import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <p className="footer-logo">Clothing <span>Store</span></p>
        <p className="footer-tagline">Koleksi fashion terbaik untuk semua kalangan.</p>
      </div>
      <div className="footer-links">
        <h4>Navigasi</h4>
        <a href="/">Home</a>
        <a href="/collection">Collection</a>
      </div>
      <div className="footer-links">
        <h4>Kebijakan</h4>
        <a href="#">Return Policy</a>
        <a href="#">Privacy Policy</a>
      </div>
    </div>
    <div className="footer-bottom">
      <p>2024 Clothing Store. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
