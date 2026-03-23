import { api } from "./client";

export async function getMaterials() {
  return api.get("/materials");
}