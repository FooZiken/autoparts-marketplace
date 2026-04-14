import api from "./client";

export function getBrands() {
  return api.get("/cars/brands");
}

export function getCarModels(brandId) {
  const query = brandId ? `?brandId=${brandId}` : "";
  return api.get(`/cars/models${query}`);
}

export function getBodies(modelId) {
  const query = modelId ? `?modelId=${modelId}` : "";
  return api.get(`/cars/bodies${query}`);
}