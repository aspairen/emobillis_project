// import { useState } from "react";
// import { useCart } from "../context/CartContext";
// import { useApi } from "../context/ApiContext";
// const CheckoutPage = () => {
//   const {cart, calculateTotalPrice, clearCart} = useCart();
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     email: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleCheckout = (e) => {
//     e.preventDefault();
//     console.log("Order Submitted", { formData, cart });
//     clearCart(); // Clear the cart after checkout
//     alert("Order placed successfully!");
//   };

//   return (
//     <div className="container my-4">
//       <h1 className="text-center">Checkout</h1>
//       <div className="row">
//         <div className="col-md-6">
//           <h3>Order Summary</h3>
//           <ul className="list-group">
//             {cart.map((item) => (
//               <li key={item.id} className="list-group-item">
//                 {item.name} - ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
//               </li>
//             ))}
//           </ul>
//           <h4 className="mt-3">
//             Total: ${calculateTotalPrice().toFixed(2)}
//           </h4>
//         </div>
//         <div className="col-md-6">
//           <h3>Shipping Details</h3>
//           <form action="" onSubmit={handleCheckout}>
//             <div className="mb-3">
//               <label className="form-label">Name</label>
//               <input 
//               type="text"
//               className="from-control" 
//               name="name"
//               value={FormDataEvent.name}
//               onChange={handleInputChange}
//               required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Address</label>
//               <textarea
//                 className="form-control"
//                 name="address" 
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 required
//                 ></textarea>
//             </div>
//             <div className="mb-3">
//               <label  className="form-label">Email</label>
//               <input 
//                 type="text" 
//                 className="form-control"
//                 name="email" 
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                  />
//             </div>
//             <button type="submit" className="btn btn-success">Place Order</button>
//           </form>
//         </div>

//       </div>
//     </div>
//   )
// } 

// export default CheckoutPage;




import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useApi } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { createOrder } = useApi();
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

    const orderData = {
      user: 1, // Replace with dynamic user ID
      total_price: calculateTotalPrice(),
      items: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping_details: formData, // Include form data in order
    };

    try {
      await createOrder(orderData); // Use ApiContext's createOrder
      clearCart(); // Clear the cart after successful order submission
      navigate("/thank-you");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
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
            {cart.map((item) => (
              <li key={item.id} className="list-group-item">
                {item.name} - ${item.price.toFixed(2)} x {item.quantity} = $
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
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
    </div>
  );
};

export default CheckoutPage;
