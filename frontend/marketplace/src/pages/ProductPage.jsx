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
    load();
  }, [modelId]);

  async function load() {
    try {
      const m = await getModel(modelId);
      setModel(m);

      const mats = await getMaterials();
      setMaterials(mats);

      const prs = await getPrinters();
      setPrinters(prs);
    } catch (e) {
      console.error(e);
    }
  }

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

  if (!model) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.image}>3D Preview</div>

      <div style={styles.info}>
        <h1>{model.name}</h1>
        <p>{model.description}</p>

        <button>Add to favorites</button>

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
};