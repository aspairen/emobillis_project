// 
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Checkout from "../components/Checkout";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
  });

  // Local state for user and token
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => {
    try {
      const token = localStorage.getItem("authToken");
      return token ? JSON.parse(token) : null;
    } catch (e) {
      console.error("Error parsing authToken from localStorage:", e);
      return null;
    }
  });

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return payload.exp * 1000 < Date.now(); // Expiry check
    } catch (e) {
      console.error("Error decoding token:", e);
      return true; // Expired if decoding fails
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (authToken && !isTokenExpired(authToken)) {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/auth/profile/", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          logout(); // Clear invalid token
        }
      } else {
        setUser(null);
        logout(); // Logout if token is expired
      }
    };

    fetchUser();
  }, [authToken]);

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
  };

  const calculateTotalPrice = () => {
    const cart = [
      { id: 1, name: "Product A", price: 10.99, quantity: 2 },
      { id: 2, name: "Product B", price: 25.49, quantity: 1 },
    ]; // Replace with your actual cart logic
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!authToken || !user) {
      setError("You must be logged in to place an order.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const orderData = {
      user: user.id,
      total_price: calculateTotalPrice(),
      items: [
        { product: 1, quantity: 2, price: 10.99 },
        { product: 2, quantity: 1, price: 25.49 },
      ], // Replace with actual cart items
      shipping_details: formData,
    };
    console.log("Order Data: ", orderData)
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/shop/orders/", orderData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("Order placed:", response.data);
      navigate("/thank-you");
    } catch (err) {
      console.error("Order submission error:", err);
      setError("Failed to submit the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Checkout</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Processing your order...</div>}
      <div className="row">
        <div className="col-md-6">
          <h3>Order Summary</h3>
          <ul className="list-group">
            <li className="list-group-item">Product A - $10.99 x 2 = $21.98</li>
            <li className="list-group-item">Product B - $25.49 x 1 = $25.49</li>
          </ul>
          <h4 className="mt-3">Total: ${calculateTotalPrice().toFixed(2)}</h4>
        </div>
        <div className="col-md-6">
          <h3>Shipping Details</h3>
          <form onSubmit={handleCheckout}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
      <div className="mt-4">
        <h3>Complete Payment</h3>
        <Checkout
          orderId="TEMP_ORDER_ID"
          totalAmount={calculateTotalPrice()}
          userPhoneNumber={user?.phone || "254712345678"}
          authToken={authToken}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
