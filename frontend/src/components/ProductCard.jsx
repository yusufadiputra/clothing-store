import { Link } from 'react-router-dom';
import './ProductCard.css';

const BASE_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'http://localhost:5000';

const ProductCard = ({ product }) => {
  const imageUrl = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${BASE_URL}${product.image}`
    : 'https://placehold.co/400x480/f5f5f5/ccc?text=No+Image';

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-img">
        <img src={imageUrl} alt={product.name} />
        <span className="product-card-category">{product.category}</span>
      </div>
      <div className="product-card-info">
        <p className="product-card-name">{product.name}</p>
        <p className="product-card-price">${product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
