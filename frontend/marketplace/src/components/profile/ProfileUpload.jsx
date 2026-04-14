// frontend/src/components/profile/ProfileUpload.jsx

import { useState, useEffect } from "react";
import { createModel } from "../../api/models";
import { getMaterials } from "../../api/materials";
import {
  getBrands,
  getCarModels,
  getBodies,
} from "../../api/cars";

export default function ProfileUpload() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [materials, setMaterials] = useState([]);

  const [brandId, setBrandId] = useState("");
  const [carModelId, setCarModelId] = useState("");
  const [bodyId, setBodyId] = useState("");

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [bodies, setBodies] = useState([]);

  const [oemNumber, setOemNumber] = useState("");
  const [isCustomPart, setIsCustomPart] = useState(false);
  const [isTested, setIsTested] = useState(false);

  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  // 🔹 initial load
  useEffect(() => {
    getMaterials().then(setMaterials);
    getBrands().then(setBrands);
  }, []);

  // 🔹 load models when brand changes
  useEffect(() => {
    if (!brandId) {
      setModels([]);
      setCarModelId("");
      setBodies([]);
      setBodyId("");
      return;
    }

    getCarModels(brandId).then(setModels);
  }, [brandId]);

  // 🔹 load bodies when model changes
  useEffect(() => {
    if (!carModelId) {
      setBodies([]);
      setBodyId("");
      return;
    }

    getBodies(carModelId).then(setBodies);
  }, [carModelId]);

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

    if (brandId) formData.append("brandId", brandId);
    if (carModelId) formData.append("carModelId", carModelId);
    if (bodyId) formData.append("bodyId", bodyId);

    if (!isCustomPart && oemNumber) {
      formData.append("oemNumber", oemNumber);
    }

    formData.append("isCustomPart", isCustomPart);
    formData.append("isTested", isTested);

    for (const img of images) {
      formData.append("images", img);
    }

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
        {/* BASIC */}
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

        {/* MATERIAL */}
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

        {/* CAR */}
        <h3>Car Info</h3>

        <select
          value={brandId}
          onChange={(e) => {
            setBrandId(e.target.value);
          }}
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={carModelId}
          onChange={(e) => setCarModelId(e.target.value)}
        >
          <option value="">Select Model</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          value={bodyId}
          onChange={(e) => setBodyId(e.target.value)}
        >
          <option value="">Select Body</option>
          {bodies.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.productionStart}–{b.productionEnd})
            </option>
          ))}
        </select>

        {/* OEM */}
        <h3>OEM</h3>

        <label>
          <input
            type="checkbox"
            checked={isCustomPart}
            onChange={(e) => setIsCustomPart(e.target.checked)}
          />
          Custom part
        </label>

        {!isCustomPart && (
          <input
            placeholder="OEM number"
            value={oemNumber}
            onChange={(e) => setOemNumber(e.target.value)}
          />
        )}

        {/* TESTED */}
        <label>
          <input
            type="checkbox"
            checked={isTested}
            onChange={(e) => setIsTested(e.target.checked)}
          />
          Tested on real car
        </label>

        {/* STL */}
        <h3>STL</h3>

        <input
          type="file"
          accept=".stl"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* IMAGES */}
        <h3>Images</h3>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
        />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}