import api from "./client";

// GET all models
export const getModels = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/models${query ? `?${query}` : ""}`);
};

// 🔥 My Models
export const getMyModels = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/models/my${query ? `?${query}` : ""}`);
};

// GET one model
export const getModel = (id) => {
  return api.get(`/models/${id}`);
};

// CREATE model (FormData!)
export const createModel = (formData) => {
  return api.post("/models", formData);
};

// UPDATE
export const updateModel = (id, data) => {
  return api.post(`/models/${id}`, data);
};

// DELETE
export const deleteModel = (id) => {
  return api.post(`/models/${id}`);
};