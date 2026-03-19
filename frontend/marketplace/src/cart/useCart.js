import { useState } from "react";

export const useCart = () => {
  const [items, setItems] = useState([]);

  const addToCart = (model) => {
    setItems((prev) => [...prev, model]);
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
  };
};