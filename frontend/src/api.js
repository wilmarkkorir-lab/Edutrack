// Tiny fetch wrapper. In dev, Vite proxies /api to Django; in production they share an origin.
const BASE = import.meta.env.VITE_API_URL || "";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => (t ? localStorage.setItem("token", t) : localStorage.removeItem("token"));

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && getToken()) headers.Authorization = `Token ${getToken()}`;

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw Object.assign(new Error("Can't reach the server. Check your connection and try again."), { fields: {} });
  }

  if (res.status === 401 && auth) {
    setToken(null);
    window.dispatchEvent(new Event("auth-expired"));
  }
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw Object.assign(new Error(data?.detail || "Something went wrong. Please try again."), {
      fields: data && typeof data === "object" ? data : {},
      status: res.status,
    });
  }
  return data;
}

export const api = {
  login: (username, password) => request("/auth/login/", { method: "POST", body: { username, password }, auth: false }),
  logout: () => request("/auth/logout/", { method: "POST" }),
  stats: () => request("/students/stats/"),
  list: (params) => request(`/students/?${new URLSearchParams(params)}`),
  create: (data) => request("/students/", { method: "POST", body: data }),
  update: (id, data) => request(`/students/${id}/`, { method: "PUT", body: data }),
  remove: (id) => request(`/students/${id}/`, { method: "DELETE" }),
};
