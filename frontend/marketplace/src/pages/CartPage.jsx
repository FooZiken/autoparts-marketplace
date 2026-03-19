import { useEffect, useState } from "react";
import { useCartContext } from "../cart/CartContext";
import { createOrder } from "../api/orders";
import { getMaterials } from "../api/materials";
import { getPrinters } from "../api/printers";

export default function CartPage() {
  const { items, removeFromCart, clearCart } = useCartContext();

  const [materials, setMaterials] = useState([]);
  const [printers, setPrinters] = useState([]);

  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");

  useEffect(() => {
    getMaterials().then(setMaterials);
    getPrinters().then(setPrinters);
  }, []);

  const handleCheckout = async () => {
    if (!selectedMaterial || !selectedPrinter) {
      alert("Select material and printer");
      return;
    }

    try {
      for (const item of items) {
        await createOrder({
          modelId: item.id,
          materialId: selectedMaterial,
          printerId: selectedPrinter,
        });
      }

      clearCart();
      alert("Orders created");
    } catch (e) {
      console.error(e);
      alert("Checkout failed");
    }
  };

  return (
    <div>
      <h1>Cart</h1>

      {/* 🧾 items */}
      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>

          <button onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      ))}

      <hr />

      {/* 🧪 materials */}
      <h3>Select Material</h3>
      <select
        value={selectedMaterial}
        onChange={(e) => setSelectedMaterial(e.target.value)}
      >
        <option value="">-- select material --</option>
        {materials.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      {/* 🖨 printers */}
      <h3>Select Printer</h3>
      <select
        value={selectedPrinter}
        onChange={(e) => setSelectedPrinter(e.target.value)}
      >
        <option value="">-- select printer --</option>
        {printers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <br />
      <br />

      <button onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}