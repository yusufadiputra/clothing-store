import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './ProductDetailPage.css';

const BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || '');
      })
      .catch(() => navigate('/collection'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    await api.delete(`/products/${id}`);
    navigate('/my-products');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 40px', color: 'var(--gray-light)' }}>
        Memuat...
      </div>
    );
  }

  if (!product) return null;

  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${BASE_URL}${product.image}`
    : 'https://placehold.co/600x700/f5f5f5/ccc?text=No+Image';

  const ownerId =
    product.owner && typeof product.owner === 'object' ? product.owner._id : product.owner;
  const isOwner = user && ownerId === user.id;

  return (
    <div className="container product-detail">
      <div className="product-detail-grid">
        <div className="product-detail-images">
          <div className="thumb-list">
            <img src={imageUrl} alt={product.name} className="thumb active" />
          </div>
          <div className="product-main-img">
            <img src={imageUrl} alt={product.name} />
          </div>
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-rating">
            <span className="stars">★★★★☆</span>
            <span className="review-count">(122)</span>
          </div>

          <p className="product-detail-price">${product.price}</p>
          <p className="product-detail-desc">{product.description}</p>

          <div className="size-selector">
            <p className="size-label">Select Size</p>
            <div className="size-options">
              {product.sizes?.map((s) => (
                <button
                  key={s}
                  className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', maxWidth: 280, padding: 14 }}
          >
            Add to Cart
          </button>

          <div className="product-detail-meta">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>

          {isOwner && (
            <div className="product-owner-actions">
              <Link to={`/products/${id}/edit`} className="btn-outline">
                Edit Produk
              </Link>
              <button className="btn-danger" onClick={handleDelete}>
                Hapus Produk
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
