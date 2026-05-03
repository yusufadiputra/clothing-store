import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          Clothing <span>Store</span>
        </Link>

        <nav className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/collection" className={({ isActive }) => isActive ? 'active' : ''}>
            Collection
          </NavLink>
          {user && (
            <NavLink to="/my-products" className={({ isActive }) => isActive ? 'active' : ''}>
              My Products
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-username">{user.name}</span>
              <Link to="/products/new" className="btn-primary" style={{ fontSize: 12, padding: '8px 20px' }}>
                + Add Product
              </Link>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
