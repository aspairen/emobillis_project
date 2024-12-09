import { useState, useContext } from "react";
import { useCart } from "../context/CartContext";
import { useApi } from "../context/ApiContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Checkout from "../components/Checkout";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { createOrder } = useApi();
  const { user, authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateTotalPrice = () => {
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
      items: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping_details: formData,
    };

    try {
      await createOrder(orderData);
      clearCart();
      navigate("/thank-you");
    } catch (err) {
      console.error("Order submission error:", err);
      setError("Failed to submit the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotalPrice();

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Checkout</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center">Processing your order...</div>}
      <div className="row">
        <div className="col-md-6">
          <h3>Order Summary</h3>
          <ul className="list-group">
            {cart.map((item) => (
              <li key={item.id} className="list-group-item">
                {item.name} - ${item.price.toFixed(2)} x {item.quantity} = $
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <h4 className="mt-3">Total: ${totalAmount.toFixed(2)}</h4>
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
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
          totalAmount={totalAmount}
          userPhoneNumber={formData.phone || user?.phone || "254712345678"}
          authToken={authToken}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
