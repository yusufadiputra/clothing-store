import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import './CollectionPage.css';

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const fetchProducts = (cat, q) => {
    setLoading(true);
    const params = {};
    if (cat) params.category = cat;
    if (q) params.search = q;
    api
      .get('/products', { params })
      .then(({ data }) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(category, search);
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(category, search);
  };

  return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
      <div className="section-title">
        <h2>
          All <span>Collections</span>
        </h2>
      </div>
      <p className="section-subtitle">Semua produk tersedia untuk Anda.</p>

      <div className="collection-toolbar">
        <div className="filter-categories">
          {['', 'Men', 'Women', 'Kids'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat || 'All'}
            </button>
          ))}
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: 12 }}
          >
            Cari
          </button>
        </form>
      </div>

      {loading ? (
        <div className="products-grid-col4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '4/5',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s infinite',
              }}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-light)' }}>
          <p>Tidak ada produk ditemukan.</p>
        </div>
      ) : (
        <div className="products-grid-col4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
