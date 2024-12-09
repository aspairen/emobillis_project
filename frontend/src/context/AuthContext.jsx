/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({
  user: null,
  authToken: null,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }) => {
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
          const response = await axios.get("http://127.0.0.1:8000/api/auth/user/", {
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

  const login = (token) => {
    try {
      console.log("Logging in with token", token);
      localStorage.setItem("authToken", JSON.stringify(token));
      setAuthToken(token);

      const decodedUser = parseJwt(token); // Decoding token to get user info
      setUser({ username: decodedUser.username });
    } catch (e) {
      console.error("Error saving authToken to localStorage:", e);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
  };

  const parseJwt = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload; // Decoded payload
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
