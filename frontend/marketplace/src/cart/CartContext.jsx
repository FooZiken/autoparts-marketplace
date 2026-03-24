import { createContext, useContext } from "react";
import { useCart } from "./useCart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cart = useCart();

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) {
    console.error("useCartContext must be used inside CartProvider");
    return {
      addToCart: () => {},
      removeFromCart: () => {},
      cart: [],
    };
  }

  return context;
};