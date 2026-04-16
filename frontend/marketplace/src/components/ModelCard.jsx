import { useCartContext } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";
export default function ModelCard({ model }) {
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const v = model.currentVersion;

  return (
    <div
  style={styles.card}
  onClick={() => navigate(`/models/${model.id}`)}
>
      {/* IMAGE */}
      <div style={styles.image}>
        {model.images?.length ? (
          <img src={model.images[0]} alt={model.name} style={styles.img} />
        ) : (
          <span>3D</span>
        )}
      </div>

      <div style={styles.body}>
        <h3>{model.name}</h3>

        <p style={styles.desc}>{model.description}</p>

        <p style={styles.price}>€{v?.price || "—"}</p>

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

        {model.isTested && (
          <p style={{ color: "green" }}>
            ✔ Tested on real car
          </p>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(model);
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    background: "#fff",
    cursor: "pointer",
  },
  image: {
    height: "180px",
    background: "#f2f2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  body: {
    padding: "15px",
  },
  desc: {
    fontSize: "14px",
    color: "#666",
  },
  price: {
    fontWeight: "bold",
    margin: "10px 0",
  },
};