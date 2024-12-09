// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext } from "react";
import axios from "axios";

// Create a context
const ApiContext = createContext();

// Custom hook to use the ApiContext
// eslint-disable-next-line react-refresh/only-export-components
export const useApi = () => useContext(ApiContext);

// eslint-disable-next-line react/prop-types
const ApiProvider = ({ children }) => {
  const baseURL = "http://127.0.0.1:8000/api";

  // General API call handler
  const apiCall = async (method, endpoint, data = null, params = null) => {
    try {
      const response = await axios({
        method,
        url: `${baseURL}${endpoint}`,
        data,
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`API ${method.toUpperCase()} ${endpoint} Error:`, error);
      throw error.response?.data || error.message;
    }
  };

  // Define reusable API functions
  const getProducts = async () => {
    return apiCall("get", "/shop/products/");
  };

  const getProductDetail = async (id) => {
    return apiCall("get", `/shop/products/${id}/`);
  };

  const createOrder = async (orderData) => {
    try {
      // Retrieve the authToken from localStorage
      const token = JSON.parse(localStorage.getItem("authToken"));
      
      // Check if token exists, else throw an error
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }
  
      // Make the POST request to create the order
      const response = await fetch(`${baseURL}/shop/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  // Send the token in the header
        },
        body: JSON.stringify(orderData),  // Pass the order data in the body
      });
  
      // If the response is not OK, throw an error with the response message
      if (!response.ok) {
        const errorMessage = await response.text();  // Read response as text in case it's not JSON
        throw new Error(errorMessage || "Failed to create order. Please try again.");
      }
  
      // If successful, return the response data as JSON
      return await response.json();
      
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error creating order:", error);
      
      // Optionally, you can add a check here to handle specific error types (e.g., expired token)
      if (error.message.includes("authentication token")) {
        // Redirect the user to login if token is missing or invalid
        // navigate("/login");  // Uncomment if you want to redirect
      }
  
      // Rethrow the error for higher-level handling (e.g., in the UI)
      throw error;
    }
  };
  

  const getOrder = async (id) => {
    return apiCall("get", `/shop/orders/${id}/`);
  };

  const getUserCart = async () => {
    return apiCall("get", "/shop/cart/");
  };

  const updateCart = async (cartData) => {
    return apiCall("put", "/shop/cart/", cartData);
  };

  const clearCart = async () => {
    return apiCall("delete", "/shop/cart/");
  };

  return (
    <ApiContext.Provider
      value={{
        getProducts,
        getProductDetail,
        createOrder,
        getOrder,
        getUserCart,
        updateCart,
        clearCart,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
