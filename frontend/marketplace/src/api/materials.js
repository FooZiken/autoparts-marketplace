import api from "./client";

export const getMaterials = () => {
  return api.get("/materials");
};