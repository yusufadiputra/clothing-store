import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products')
      .then(({ data }) => setProducts(data.slice(0, 10)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">Our Bestsellers</p>
          <h1 className="hero-title">Latest Arrivals</h1>
          <Link to="/collection" className="hero-cta">
            Shop Now <span>&#8212;&#8212;</span>
          </Link>
        </div>
        <div className="hero-visual" />
      </section>

      <section className="section container">
        <div className="section-title">
          <h2>
            Latest <span>Collections</span>
          </h2>
        </div>
        <p className="section-subtitle">Temukan koleksi pakaian terbaru pilihan kami.</p>

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada produk. Jadilah yang pertama menambahkan!</p>
            <Link to="/products/new" className="btn-primary" style={{ marginTop: 20 }}>
              + Tambah Produk
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link to="/collection" className="btn-outline">
            Lihat Semua
          </Link>
        </div>
      </section>

      <section className="features container">
        <div className="feature-item">
          <h3>100% Original</h3>
          <p>Semua produk dijamin keasliannya langsung dari brand.</p>
        </div>
        <div className="feature-item">
          <h3>Cash on Delivery</h3>
          <p>Bayar saat barang tiba, aman dan mudah.</p>
        </div>
        <div className="feature-item">
          <h3>Easy Return</h3>
          <p>Kebijakan pengembalian mudah dalam 7 hari.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
