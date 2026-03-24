import { useState, useEffect } from "react";
import { createModel } from "../../api/models";
import { getMaterials } from "../../api/materials";

export default function ProfileUpload() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [materials, setMaterials] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    getMaterials().then(setMaterials);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Select STL file");
      return;
    }

    if (!materialId) {
      alert("Select material");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("materialId", materialId);

    try {
      await createModel(formData);
      alert("Model uploaded!");
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Model</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* 🔥 ВМЕСТО input → select */}
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

        <input
          type="file"
          accept=".stl"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}