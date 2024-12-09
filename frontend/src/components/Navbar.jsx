import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { useCart } from "./../context/CartContext";
import { AuthContext } from "./../context/AuthContext"; // Import AuthContext

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`); // Redirect to search page with query
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
      <div className="container">
        {/* Brand Name */}
        <Link className="navbar-brand fw-bold text-success" to="/">
          Mechasoko
        </Link>

        {/* Navbar Toggle for Small Screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Centered Navigation Links */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/faq">
                FAQ
              </Link>
            </li>
          </ul>

          {/* Right-Side Actions */}
          <div className="d-flex align-items-center">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="d-flex me-3">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-sm btn-outline-success ms-2"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="me-3 text-dark position-relative">
              <i className="fas fa-shopping-cart"></i>
              {cartItemCount > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Authentication Links */}
            {user ? (
              <>
                <Link to="/profile" className="me-3 text-dark">
                  <i className="fas fa-user"></i>
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm me-2">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
