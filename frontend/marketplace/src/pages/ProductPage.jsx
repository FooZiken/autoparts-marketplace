import { useEffect, useState } from "react";
import { getModel } from "../api/models";
import { getMaterials } from "../api/materials";
import { getPrinters } from "../api/printers";
import { createOrder } from "../api/orders";
import { useAuth } from "../auth/AuthContext";

export default function ProductPage({ modelId }) {
  const { user } = useAuth();

  const [model, setModel] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [printers, setPrinters] = useState([]);

  const [materialId, setMaterialId] = useState("");
  const [printerId, setPrinterId] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getModel(modelId).then(setModel);
    getMaterials().then(setMaterials);
    getPrinters().then(setPrinters);
  }, [modelId]);

  const handleOrder = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (!materialId || !printerId) {
      alert("Select material and printer");
      return;
    }

    try {
      setLoading(true);

      await createOrder({
        modelId,
        materialId,
        printerId,
      });

      alert("Order created!");
    } catch (e) {
      console.error(e);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ ДОБАВЛЕНО: избранное
  const addToFavorites = () => {
    const existing = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    if (existing.find((f) => f.id === model.id)) {
      alert("Already in favorites");
      return;
    }

    const updated = [
      ...existing,
      {
        id: model.id,
        name: model.name,
      },
    ];

    localStorage.setItem("favorites", JSON.stringify(updated));

    alert("Added to favorites");
  };

  if (!model) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* LEFT: image */}
      <div style={styles.image}>
        3D Preview
      </div>

      {/* RIGHT: info */}
      <div style={styles.info}>
        <h1>{model.name}</h1>
        <p>{model.description}</p>

        {/* ⭐ КНОПКА ИЗБРАННОГО */}
        <button onClick={addToFavorites}>
          Add to favorites
        </button>

        {/* MATERIAL */}
        <div>
          <h4>Material</h4>
          <select
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
          >
            <option value="">Select material</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* PRINTER */}
        <div>
          <h4>Printer</h4>
          <select
            value={printerId}
            onChange={(e) => setPrinterId(e.target.value)}
          >
            <option value="">Select printer</option>
            {printers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* PRICE */}
        <p style={styles.price}>
          Price: calculated on backend
        </p>

        <button onClick={handleOrder} disabled={loading}>
          {loading ? "Ordering..." : "Order now"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "40px",
    padding: "40px",
  },
  image: {
    width: "400px",
    height: "300px",
    background: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  price: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "20px 0",
  },
};