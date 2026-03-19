const API_URL = "http://localhost:3000";

export const api = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  return res.json();
};