import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './MyProductsPage.css';

const BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = () => {
    setLoading(true);
    api
      .get('/products/my')
      .then(({ data }) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    await api.delete(`/products/${id}`);
    fetchMyProducts();
  };

  return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <div className="section-title">
            <h2>
              My <span>Products</span>
            </h2>
          </div>
          <p className="section-subtitle">Daftar produk yang kamu tambahkan.</p>
        </div>
        <Link to="/products/new" className="btn-primary">
          + Tambah Produk
        </Link>
      </div>

      {loading ? (
        <p style={{ color: 'var(--gray-light)' }}>Memuat...</p>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: 'var(--gray-light)', marginBottom: 20 }}>
            Belum ada produk. Tambahkan yang pertama!
          </p>
          <Link to="/products/new" className="btn-primary">
            + Tambah Produk
          </Link>
        </div>
      ) : (
        <div className="my-products-table">
          <div className="table-header">
            <span>Gambar</span>
            <span>Nama Produk</span>
            <span>Kategori</span>
            <span>Harga</span>
            <span>Aksi</span>
          </div>
          {products.map((p) => {
            const img = p.image
              ? p.image.startsWith('http')
                ? p.image
                : `${BASE_URL}${p.image}`
              : 'https://placehold.co/80x96/f5f5f5/ccc?text=X';
            return (
              <div key={p._id} className="table-row">
                <img src={img} alt={p.name} className="table-img" />
                <span className="table-name">{p.name}</span>
                <span className="table-cat">{p.category}</span>
                <span className="table-price">${p.price}</span>
                <div className="table-actions">
                  <Link
                    to={`/products/${p._id}`}
                    className="btn-outline"
                    style={{ fontSize: 11, padding: '6px 14px' }}
                  >
                    Detail
                  </Link>
                  <Link
                    to={`/products/${p._id}/edit`}
                    className="btn-outline"
                    style={{ fontSize: 11, padding: '6px 14px' }}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn-danger"
                    style={{ fontSize: 11, padding: '6px 14px' }}
                    onClick={() => handleDelete(p._id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
