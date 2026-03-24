import { useState } from "react";
import { createModel } from "../../api/models";

export default function UploadModelPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Select STL file");
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
    <div style={{ padding: 20 }}>
      <h1>Upload Model</h1>

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

        <input
          placeholder="Material ID"
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
        />

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