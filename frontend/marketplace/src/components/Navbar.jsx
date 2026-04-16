import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { getFilterOptions } from "../api/models";
import { Link } from "react-router-dom";

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();

  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    body: "",
    category: "",
    query: "",
  });

  const [options, setOptions] = useState({
    brands: [],
    models: [],
    bodies: [],
  });

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions() {
    try {
      const data = await getFilterOptions();

      setOptions({
        brands: data?.brands || [],
        models: data?.models || [],
        bodies: data?.bodies || [],
      });
    } catch (e) {
      console.error("Failed to load filters", e);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "brand") {
      setFilters({
        ...filters,
        brand: value,
        model: "",
        body: "",
      });
      return;
    }

    if (name === "model") {
      setFilters({
        ...filters,
        model: value,
        body: "",
      });
      return;
    }

    setFilters({
      ...filters,
      [name]: value,
    });
  }

  function handleSearch() {
    onSearch(filters);
  }

  const filteredModels = filters.brand
    ? options.models.filter((m) => m.brandId === filters.brand)
    : options.models;

  const filteredBodies = filters.model
    ? options.bodies.filter((b) => b.carModelId === filters.model)
    : options.bodies;

  return (
    <div>
      {/* TOP */}
      <div style={styles.top}>
        <Link to="/" style={styles.logo}>
          <span style={{ color: "#f4b400" }}>My</span> Logo
        </Link>

        <div style={styles.right}>
          <Link to="/about"><button>О проекте</button></Link>

          {!user ? (
            <>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/register"><button>Register</button></Link>
            </>
          ) : (
            <>
              <Link to="/profile">
                <button>{user.email}</button>
              </Link>

              <Link to="/cart"><button>Cart</button></Link>

              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div style={styles.search}>
        <select name="brand" value={filters.brand} onChange={handleChange}>
          <option value="">Brand</option>
          {options.brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select name="model" value={filters.model} onChange={handleChange}>
          <option value="">Model</option>
          {filteredModels.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select name="body" value={filters.body} onChange={handleChange}>
          <option value="">Body</option>
          {filteredBodies.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">Category</option>
        </select>

        <input
          name="query"
          value={filters.query}
          placeholder="Search by OEM, keyword..."
          onChange={handleChange}
        />

        <button onClick={handleSearch}>GO</button>
      </div>
    </div>
  );
}

const styles = {
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    borderBottom: "1px solid #e5e5e5",
    background: "#fff",
  },

  logo: {
    fontSize: "26px",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  search: {
    display: "flex",
    gap: "10px",
    padding: "15px 30px",
    borderBottom: "1px solid #e5e5e5",
    background: "#fafafa",
  },
};