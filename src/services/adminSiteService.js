import { apiFetch } from "./api/apiService";

const page = (response) => response?.data || [];

export const navigationAdminService = {
  list: async () => page(await apiFetch("/admin/navigation")),
  create: (data) => apiFetch("/admin/navigation", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/admin/navigation/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/admin/navigation/${encodeURIComponent(id)}`, { method: "DELETE" }),
  reorder: (items) => apiFetch("/admin/navigation/order", { method: "PUT", body: JSON.stringify({ items }) }),
};

export const homepageAdminService = {
  list: async () => page(await apiFetch("/admin/homepage-sections")),
  create: (data) => apiFetch("/admin/homepage-sections", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/admin/homepage-sections/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/admin/homepage-sections/${encodeURIComponent(id)}`, { method: "DELETE" }),
  reorder: (ids) => apiFetch("/admin/homepage-sections/order", { method: "PUT", body: JSON.stringify({ ids }) }),
};
