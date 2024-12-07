import { Link } from "react-router-dom"; // Import Link for navigation
import { useCart } from "./../context/CartContext"; // Import the Cart Context

const Navbar = () => {
  const { cart } = useCart(); // Access the cart from context
  const isAuthenticated = !!localStorage.getItem("authToken"); // Check if the user is authenticated
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total items

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear token
    window.location.reload(); // Refresh page to reflect logged-out state
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
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Centered Navigation Links */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
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
            {/* Search Icon */}
            <Link to="/search" className="me-3 text-dark">
              <i className="fas fa-search"></i>
            </Link>

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
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="me-3 text-dark">
                  <i className="fas fa-user"></i>
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
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











// import { Link } from "react-router-dom"; // Import Link for navigation
// import { useCart } from "./../context/CartContext"; // Import the Cart Context

// const Navbar = () => {
//   const { cart } = useCart(); // Access the cart from context

//   const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total items

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
//       <div className="container">
//         <Link className="navbar-brand fw-bold text-success" to="/">
//           Mechasoko
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav mx-auto">
//             <li className="nav-item">
//               <Link className="nav-link active" to="/">
//                 Home
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/shop">
//                 Shop
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/about">
//                 About
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/contact">
//                 Contact
//               </Link>
//             </li>
//           </ul>
//           <div className="d-flex">
//             <Link to="/search" className="me-3 text-dark">
//               <i className="fas fa-search"></i>
//             </Link>
//             <Link to="/cart" className="me-3 text-dark position-relative">
//               <i className="fas fa-shopping-cart"></i>
//               {cartItemCount > 0 && (
//                 <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
//                   {cartItemCount}
//                 </span>
//               )}
//             </Link>
//             <Link to="/profile" className="text-dark">
//               <i className="fas fa-user"></i>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
