import client from "./client";

// ================= LIST =================
export async function getModels(filters = {}) {
  const res = await client.get("/models", {
    params: {
      search: filters.query || undefined,
      brandId: filters.brand || undefined,
      carModelId: filters.model || undefined,
      bodyId: filters.body || undefined,
    },
  });

  return res.data?.data || [];
}

// ================= ONE =================
export async function getModel(id) {
  const res = await client.get(`/models/${id}`);
  return res.data;
}

// ================= CREATE =================
export async function createModel(formData) {
  const res = await client.post("/models", formData);
  return res.data;
}

// ================= UPDATE =================
export async function updateModel(id, dto) {
  const res = await client.post(`/models/${id}`, dto);
  return res.data;
}

// ================= DELETE =================
export async function deleteModel(id) {
  const res = await client.delete(`/models/${id}`);
  return res.data;
}

// ================= MY MODELS =================
export async function getMyModels(params = {}) {
  const res = await client.get("/models/my", { params });
  return res.data;
}

// ================= FILTER OPTIONS =================
export async function getFilterOptions() {
  const res = await client.get("/models/filters/options");

  if (!res?.data) {
    return {
      brands: [],
      models: [],
      bodies: [],
    };
  }

  return res.data;
}