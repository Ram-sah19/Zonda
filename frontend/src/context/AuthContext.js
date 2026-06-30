import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/auth";

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      const userObj = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isSeller: data.isSeller,
        isAdmin: data.isAdmin,
        adminRole: data.adminRole,
        sellerStatus: data.sellerStatus,
        isDeliveryPartner: data.isDeliveryPartner,
        deliveryPartnerStatus: data.deliveryPartnerStatus,
      };
      setUser(userObj);

      return { success: true, user: userObj };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      const userObj = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isSeller: data.isSeller,
        isAdmin: data.isAdmin,
        adminRole: data.adminRole,
      };
      setUser(userObj);

      return { success: true, user: userObj };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signupAdmin = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/signup-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Admin registration failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      const userObj = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
        adminRole: data.adminRole,
      };
      setUser(userObj);

      return { success: true, user: userObj };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signupSeller = async (sellerData) => {
    try {
      const response = await fetch(`${API_URL}/signup-seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sellerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Seller registration failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isSeller: data.isSeller,
        sellerDetails: data.sellerDetails,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signupDeliveryPartner = async (partnerData) => {
    try {
      const response = await fetch(`${API_URL}/signup-delivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partnerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delivery Partner registration failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isDeliveryPartner: data.isDeliveryPartner,
        deliveryPartnerStatus: data.deliveryPartnerStatus,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const becomeSeller = async () => {
    try {
      const response = await fetch(`${API_URL}/become-seller`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to become a seller");
      }

      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    becomeSeller,
    signupSeller,
    signupAdmin,
    signupDeliveryPartner,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
