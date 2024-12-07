import { useCart } from "./../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Cart = () => {
  const { cart, updateCartItemQuantity, removeFromCart, clearCart, calculateTotalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return <div className="text-center my-4">Your cart is empty!</div>;
  }

  const handleCheckout = () => {
    navigate("/checkout"); // Navigate to the checkout page
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Shopping Cart</h1>
      <div className="row">
        <div className="col-12">
          <ul className="list-group">
            {cart.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex flex-column">
                  <h5>{item.name}</h5>
                  <p className="text-muted mb-2">
                    ${parseFloat(item.price).toFixed(2)} x {item.quantity} ={" "}
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="d-flex align-items-center">
                  <input
                    type="number"
                    className="form-control me-3"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartItemQuantity(item.id, parseInt(e.target.value, 10))
                    }
                    style={{ width: "70px" }}
                  />
                  <img
                    src={item.image || "https://via.placeholder.com/50"}
                    alt={item.name}
                    className="img-thumbnail"
                    style={{ width: "50px", height: "50px" }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <h3 className="text-end mt-3">
            Total: ${calculateTotalPrice().toFixed(2)}
          </h3>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-danger" onClick={clearCart}>
              Clear Cart
            </button>
            <Link to="/checkout" className="btn btn-primary float-end" onClick={handleCheckout}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;







// import { useCart } from './../context/CartContext'

// const Cart = () => {
//   const { cart, setCart } = useCart();

//   const updateQuantity = (id, newQuantity) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.id === id ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   };

//   const removeFromCart = (id) => {
//     setCart((prevCart) => prevCart.filter((item) => item.id !== id));
//   };

//   const totalPrice = cart.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

//   if (cart.length === 0) {
//     return <div className="text-center my-4">Your cart is empty!</div>;
//   }

//   return (
//     <div className="container my-4">
//       <h1 className="text-center mb-4">Shopping Cart</h1>
//       <div className="row">
//         <div className="col-12">
//           <ul className="list-group">
//             {cart.map((item) => (
//               <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
//                 <div>
//                   <h5>{item.name}</h5>
//                   <p>${parseFloat(item.price).toFixed(2)}</p>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => removeFromCart(item.id)}
//                   >
//                     Remove
//                   </button>
//                 </div>
//                 <div>
//                   <input
//                     type="number"
//                     className="form-control"
//                     min="1"
//                     value={item.quantity}
//                     onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//           <h3 className="text-end mt-3">Total: ${totalPrice.toFixed(2)}</h3>
//           <button className="btn btn-primary float-end">Proceed to Checkout</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
