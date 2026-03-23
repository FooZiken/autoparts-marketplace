import { useState } from "react";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ModelsPage from "./pages/ModelsPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedModelId, setSelectedModelId] = useState(null);

  function handleNavigate(p, data) {
    setPage(p);

    if (p === "product") {
      setSelectedModelId(data); // ← теперь это ID
    }
  }

  function renderPage() {
    switch (page) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;

      case "models":
        return <ModelsPage onNavigate={handleNavigate} />;

      case "product":
        return (
          <ProductPage
            modelId={selectedModelId}
          />
        );

      case "login":
        return <LoginPage onNavigate={handleNavigate} />;

      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;

      case "cart":
        return <CartPage />;

      case "about":
        return <AboutPage />;

      case "profile":
        return <ProfilePage />;

      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  }

  return (
    <div>
      <Navbar onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
}