import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { token, user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api/cart";

  const fetchCart = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      setCart(data || { items: [] });
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [token, user, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      setError("Please log in to add items to your cart.");
      return { success: false, error: "Not authenticated" };
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }

      setCart(data);
      return { success: true };
    } catch (err) {
      console.error("Add to Cart API Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!token) return { success: false, error: "Not authenticated" };
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update quantity");
      }

      setCart(data);
      return { success: true };
    } catch (err) {
      console.error("Update Cart API Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return { success: false, error: "Not authenticated" };
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/remove/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to remove item");
      }

      setCart(data);
      return { success: true };
    } catch (err) {
      console.error("Remove from Cart API Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!token) return { success: false, error: "Not authenticated" };
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to clear cart");
      }

      setCart(data);
      return { success: true };
    } catch (err) {
      console.error("Clear Cart API Error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart && cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        error,
        fetchCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
