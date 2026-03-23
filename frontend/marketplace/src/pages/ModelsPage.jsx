import { useEffect, useState } from "react";
import { getModels } from "../api/models";
import ModelCard from "../components/ModelCard";

export default function ModelsPage({ onNavigate }) {
  const [models, setModels] = useState([]);

  useEffect(() => {
    getModels()
      .then((res) => {
        console.log("MODELS RESPONSE:", res);

        if (Array.isArray(res)) {
          setModels(res);
        } else if (Array.isArray(res.data)) {
          setModels(res.data);
        } else if (Array.isArray(res.models)) {
          setModels(res.models);
        } else {
          console.error("Unexpected models format", res);
          setModels([]);
        }
      })
      .catch((err) => {
        console.error("Models load error:", err);
      });
  }, []);

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
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
};