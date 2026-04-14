import { useEffect, useState } from "react";
import { getModels } from "../api/models";
import ModelCard from "../components/ModelCard";

export default function ModelsPage({ onNavigate }) {
  const [models, setModels] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getModels();
      setModels(data);
    } catch (e) {
      console.error("Models load error:", e);
      setModels([]);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Models</h1>

      <div style={styles.grid}>
        {models.map((m) => (
          <ModelCard
            key={m.id}
            model={m}
            onOpen={() => onNavigate("product", m.id)}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
  },
};