import { api } from "./client";

export const getModels = () => api("/models");

export const getModel = (id) => api(`/models/${id}`);