import { useEffect, useState } from "react";
import { getMyModels } from "../../api/models";
import ModelCard from "../ModelCard";

export default function ProfileModels() {
  const [models, setModels] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  async function load() {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, v]) => v !== "" && v !== null
      )
    );

    const data = await getMyModels(cleanFilters);

    console.log("MY MODELS RESPONSE:", data);

    if (Array.isArray(data)) {
      setModels(data);
    } else if (Array.isArray(data?.data)) {
      setModels(data.data);
    } else {
      console.error("Unexpected response:", data);
      setModels([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  }

  console.log("RENDER MODELS:", models);

  return (
    <div>
      <h2>My Models</h2>

      {/* FILTERS */}
      <div style={{ marginBottom: 20 }}>
        <input
          name="search"
          placeholder="Search"
          value={filters.search}
          onChange={handleChange}
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button onClick={load}>Apply</button>
      </div>

      {/* GRID */}
      <div style={grid}>
        {models.length === 0 && <p>No models found</p>}

        {models.map((m) => {
          console.log("RENDER ITEM:", m);

          return <ModelCard key={m.id} model={m} />;
        })}
      </div>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
};