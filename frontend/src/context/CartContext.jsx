import  { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load the cart from Localstorage on initialization
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Save the cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add an item to the cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // If the item is already in the cart, update its quantity
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      // Otherwise, add the new item
      return [...prevCart, item];
    });
  };

  // Remove an item from the cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Clear all items from the cart
  const clearCart = () => {
    setCart([]);
  };

  // Update the quantity of an item in the cart
  const updateCartItemQuantity = (id, quantity) => {
    if (quantity < 1) return; // Prevent setting quantity to less than 1
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Calculate the total price of all items in the cart
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        calculateTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);



// // import { createContext, useState, useContext, useEffect } from "react";

// // // Create the Cart Context 
// // const CartContext = createContext();

// // // eslint-disable-next-line react/prop-types
// // export const CartProvider = ({ children }) => {
// //   const [cart, setCart] = useState(() => {
// //   // Load Cart from LocalStorage if it exists, or default to an empty array
// //     const savedCart = localStorage.getItem("cart");
// //     return savedCart ? JSON.parse(savedCart) : [];
// //   })

// //   // Save cart to LocalStorage whenever it changes
// //   useEffect(() => {
// //     localStorage.setItem("cart", JSON.stringify(cart));
// //   }, [cart]);
  
// //   const addToCart = (product) => {
// //     setCart((prevCart) => {
// //       const existingItem = prevCart.find((item) => item.id === product.id);
// //       if (existingItem) {
// //         // If it exists, update the quantity

// //         return prevCart.map((item) =>
// //           item.id === product.id
// //   //          ? { ...item, quantity: item.quantity + 1 }
// //             : item
// //         );
// //       } else {
// //         // If it doesn't exist, add it as a new entry
// //         return [...prevCart, { ...product, quantity: 1 }];
// //       }
// //     });
// //   };

// //   const removeFromCart = (productId) => {
// //     setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
// //   }

// //   const clearCart = () => {
// //     setCart([])
// //   }
// //   return (
// //     <CartContext.Provider value={{ cart,  addToCart, removeFromCart, clearCart }}>
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // // eslint-disable-next-line react-refresh/only-export-components
// // export const useCart = () => useContext(CartContext);


// // export const CartProvider = ({ children }) => {
// //   const [cart, setCart] = useState([])

// //   const addToCart = (product) => {
// //     setCart((prevCart) => [...prevCart, product])
// //   };

// //   return (
// //     <CartContext.Provider value={{ cart, addToCart }}>
// //       {children}
// //     </CartContext.Provider>
// //   )
// // };

// import  { createContext, useContext, useState, useEffect } from "react";

// // Create the Cart Context
// const CartContext = createContext();

// // eslint-disable-next-line react/prop-types
// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     // Load cart from localStorage if it exists, or default to an empty array
//     const savedCart = localStorage.getItem("cart");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (product) => {
//     setCart((prevCart) => {
//       // Check if the product already exists in the cart
//       const existingProduct = prevCart.find((item) => item.id === product.id);

//       if (existingProduct) {
//         // If it exists, update the quantity
//         return prevCart.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         // If it doesn't exist, add it as a new entry
//         return [...prevCart, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   const removeFromCart = (productId) => {
//     setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom Hook to use the Cart Context
// // eslint-disable-next-line react-refresh/only-export-components
// export const useCart = () => {
//   return useContext(CartContext);
// };
