import { api } from "./client";

// список моделей
export async function getModels() {
  return api.get("/models");
}

// одна модель
export async function getModel(id) {
  return api.get(`/models/${id}`);
}

// upload модели
export async function uploadModel(formData) {
  return api.post("/models", formData);
}