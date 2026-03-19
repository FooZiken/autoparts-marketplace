import { useState } from "react";

export default function HomePage({ onSearch, onNavigate }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [vin, setVin] = useState("");

  const [textSearch, setTextSearch] = useState("");

  return (
    <div style={styles.container}>
      <h1>Find Auto Parts</h1>

      {/* 🔍 VIN SEARCH */}
      <div style={styles.block}>
        <h3>Search by car</h3>

        <input
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <input
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <input
          placeholder="VIN / Body number"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />

        <button
          onClick={() =>
            onSearch({ type: "car", brand, model, vin })
          }
        >
          Search
        </button>
      </div>

      {/* 🔍 TEXT SEARCH */}
      <div style={styles.block}>
        <h3>Search by OEM or keyword</h3>

        <input
          placeholder="Enter OEM or keyword"
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
        />

        <button
          onClick={() =>
            onSearch({ type: "text", value: textSearch })
          }
        >
          Search
        </button>
      </div>

      {/* CTA */}
      <div style={styles.block}>
        <h3>Join platform</h3>

        <button onClick={() => onNavigate("register")}>
          Register
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },
  block: {
    margin: "30px 0",
  },
};