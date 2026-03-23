import { useCartContext } from "../cart/CartContext";

export default function ModelCard({ model, onOpen }) {
  const { addToCart } = useCartContext();

  return (
    <div style={styles.card} onClick={onOpen}>
      {/* IMAGE */}
      <div style={styles.image}>
        <span>3D</span>
      </div>

      {/* CONTENT */}
      <div style={styles.body}>
        <h3>{model.name}</h3>
        <p style={styles.desc}>{model.description}</p>

        <p style={styles.price}>from backend</p>

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
    transition: "0.2s",
    cursor: "pointer",
  },
  image: {
    height: "150px",
    background: "#f2f2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "bold",
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