import { api } from "./client";
export const register = (data) =>
  api("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const login = (email, password) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });