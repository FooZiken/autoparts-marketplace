const BASE_URL = "http://localhost:3000";

async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(BASE_URL + url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}

const api = {
  get(url) {
    return request(url, { method: "GET" });
  },

  post(url, body) {
    const isFormData = body instanceof FormData;

    return request(url, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData
        ? {}
        : { "Content-Type": "application/json" },
    });
  },
};

export default api;