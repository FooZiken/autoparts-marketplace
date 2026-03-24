import api from "./client";

export const register = (data) => {
  return api.post("/auth/register", data);
};

export const login = (email, password) => {
  return api.post("/auth/login", {
    email,
    password,
  });
};