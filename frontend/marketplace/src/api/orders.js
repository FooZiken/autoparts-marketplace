import { api } from "./client";

export const createOrder = (data) =>
  api("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getOrders = () => api("/orders");