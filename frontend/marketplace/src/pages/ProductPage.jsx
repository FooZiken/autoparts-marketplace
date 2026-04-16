import { useEffect, useState } from "react";
import { getModel } from "../api/models";
import { getMaterials } from "../api/materials";
import { getPrinters } from "../api/printers";
import { createOrder } from "../api/orders";
import { useAuth } from "../auth/AuthContext";
import { useParams } from "react-router-dom";
export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [model, setModel] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [printers, setPrinters] = useState([]);

  const [materialId, setMaterialId] = useState("");
  const [printerId, setPrinterId] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (id) {
    load();
  }
}, [id]);

  async function load() {
  try {
    console.log("LOADING MODEL ID:", id);
    
    const m = await getModel(id);
    console.log("TYPE OF M:", typeof m);
    console.log("M VALUE:", m);
    console.log("MODEL RESPONSE:", m);
    console.log("FINAL M:", m);
    
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
        id,
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
  const isApproved = model.status === "approved";
  const canBuy = isApproved;
  return (
    <div style={styles.container}>
      <div style={styles.image}>
  {model.images?.length ? (
    <img
      src={model.images[0]}
      alt={model.name}
      style={styles.img}
    />
  ) : (
    <span>3D Preview</span>
  )}
</div>

      <div style={styles.info}>
        <h1>{model.name}</h1>
        <p>{model.description}</p>
        <p>Material: {model.material?.name || "—"}</p>

<p>
  Car: {model.car?.brand || "—"} /{" "}
  {model.car?.model || "—"} /{" "}
  {model.car?.body || "—"}
</p>

<p>
  {model.isCustomPart
    ? "Custom part"
    : `OEM: ${model.oemNumber || "—"}`}
</p>

{model.isTested ? (
  <p style={{ color: "green" }}>
    ✔ Tested on real car
  </p>
) : (
  <p style={{ color: "gray" }}>
    Not tested
  </p>
)}

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
  img: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
},
};