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

  // const createOrder = async (orderData) => {
  //   const token = localStorage.getItem("authToken"); // Adjust based on where you store the token
  
  //   const response = await fetch(`${baseURL}/shop/orders/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${token}`, // Include the user's token
  //     },
  //     body: JSON.stringify(orderData),
  //   });
  
  //   if (!response.ok) {
  //     throw new Error("Failed to create order");
  //   }
  
  //   return response.json();
  // };
  
  const createOrder = async (orderData) => {
    const token = JSON.parse(localStorage.getItem("authToken")); // Parse token from string
    console.log("Retrieved Token:", token); // Debugging to check if token is retrieved correctly
  
    if (!token) {
      throw new Error("No authentication token found");
    }
  
    const response = await fetch(`${baseURL}/shop/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure proper token format
      },
      body: JSON.stringify(orderData),
    });
  
    if (!response.ok) {
      throw new Error("Failed to create order");
    }
  
    return response.json();
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
