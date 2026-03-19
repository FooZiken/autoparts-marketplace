import { useState } from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { CartProvider } from "./cart/CartContext";

import HomePage from "./pages/HomePage";
import ModelsPage from "./pages/ModelsPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/Navbar";

function AppContent() {
  const { user } = useAuth();

  const [page, setPage] = useState("home");
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);

  return (
    <div>
      <Navbar onNavigate={setPage} />

      {page === "home" && (
        <HomePage
          onSearch={(query) => {
            setSearchQuery(query);
            setPage("models");
          }}
          onNavigate={setPage}
        />
      )}

      {page === "models" && (
        <ModelsPage
          searchQuery={searchQuery}
          onOpenModel={(id) => {
            setSelectedModel(id);
            setPage("product");
          }}
        />
      )}

      {page === "product" && selectedModel && (
        <ProductPage modelId={selectedModel} />
      )}

      {page === "cart" && user && <CartPage />}
      {page === "login" && <LoginPage />}
      {page === "register" && <RegisterPage />}
      {page === "about" && <AboutPage />}
      {page === "profile" && <ProfilePage />}

      {!user && page === "cart" && <LoginPage />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}