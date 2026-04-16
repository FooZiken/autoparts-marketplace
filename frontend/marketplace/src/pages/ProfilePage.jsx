import { useState, useEffect } from "react";
import { getOrders } from "../api/orders";
import ProfileUpload from "../components/profile/ProfileUpload";
import ProfileModels from "../components/profile/ProfileModels";
export default function ProfilePage({ onNavigate }) {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadOrders();
    loadFavorites();
  }, []);

  async function loadOrders() {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  }

  function loadFavorites() {
    const data = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(data);
  }

  function removeFavorite(id) {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Profile</h1>

      {/* TABS */}
      <div style={styles.tabs}>
        <button onClick={() => setTab("orders")}>
          Orders
        </button>

        <button onClick={() => setTab("balance")}>
          Balance
        </button>

        <button onClick={() => setTab("favorites")}>
          Favorites
        </button>

        <button onClick={() => setTab("upload")}>
          Upload
        </button>

        <button onClick={() => setTab("models")}>
          My Models
        </button>
      </div>

      {/* ORDERS */}
      {tab === "orders" && (
        <div>
          {!orders.length && <p>No orders yet</p>}

          {orders.map((order) => {
            const status =
              order.printJobs?.[0]?.status || order.status;

            return (
              <div key={order.id} style={styles.card}>
                <h3>Order #{order.id}</h3>
                <p>Status: {status}</p>
              </div>
            );
          })}
        </div>
      )}
      
      {/* UPLOAD */}
      {tab === "upload" && <ProfileUpload />}

      {/* BALANCE */}
      {tab === "balance" && (
        <div>
          <h2>Balance</h2>
          <p>0 €</p>
          <button disabled>Top up (coming soon)</button>
        </div>
      )}

      {/* FAVORITES */}
      {tab === "favorites" && (
        <div>
          {!favorites.length && <p>No favorites</p>}

          {favorites.map((item) => (
            <div key={item.id} style={styles.card}>
              <p>{item.name}</p>

              <button onClick={() => removeFavorite(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MyModels */}
      {tab === "models" && (
  <ProfileModels onNavigate={onNavigate} />
)}
    </div>
  );
}

const styles = {
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  card: {
    border: "1px solid #ddd",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
};