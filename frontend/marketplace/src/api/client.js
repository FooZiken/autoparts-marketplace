const API_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(API_URL + url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  return res.json();
}

export const api = {
  get(url) {
    return request(url, {
      method: "GET",
    });
  },

  post(url, body) {
    const isFormData = body instanceof FormData;

    return request(url, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData
        ? {} // ❗ НЕ трогаем headers для FormData
        : { "Content-Type": "application/json" },
    });
  },
};