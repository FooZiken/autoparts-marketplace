import { useEffect, useState } from "react";
import ModelCard from "../components/ModelCard";
import { getModels } from "../api/models";

export default function HomePage({ onNavigate, filters }) {
  const [models, setModels] = useState([]);

  useEffect(() => {
    load();
  }, [filters]);

  async function load() {
    try {
      const data = await getModels(filters);
      setModels(data);
    } catch (e) {
      console.error("Failed to load models", e);
      setModels([]);
    }
  }

  return (
    <div style={styles.container}>
      
      {/* GRID */}
      <h2 style={{ marginTop: "40px" }}>
        Latest models
      </h2>

      <div style={styles.grid}>
        {!models || models.length === 0 ? (
          <p>No models found</p>
        ) : (
          models.map((m) => (
            <ModelCard
              key={m.id}
              model={m}
              onOpen={() => onNavigate("product", m.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px 30px",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "10px",
  },

  heroMain: {
    background: "#eee",
    padding: "40px",
    minHeight: "250px",
    textAlign: "left",
  },

  side: {
    display: "grid",
    gap: "10px",
  },

  box: {
    background: "#f5f5f5",
    padding: "20px",
  },

  grid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
  },
};