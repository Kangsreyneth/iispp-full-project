import { apiFetch } from "./api/apiService";
import { uploadImage } from "./storageService";

async function listAll(max = 300, search = "") {
  const rows = [];
  let cursor = "";
  do {
    const query = new URLSearchParams({ limit: String(Math.min(50, max - rows.length)) });
    if (cursor) query.set("cursor", cursor);
    if (search.trim()) query.set("q", search.trim());
    const response = await apiFetch(`/admin/media?${query}`);
    rows.push(...(response?.data || []));
    cursor = response?.meta?.nextCursor || "";
  } while (cursor && rows.length < max);
  return rows.slice(0, max);
}

const mediaService = {
  listAll,
  upload: uploadImage,
  updateAltText: async (id, altText) => (await apiFetch(`/admin/media/${encodeURIComponent(id)}`, {
    method: "PUT", body: JSON.stringify({ altText }),
  }))?.data,
  remove: (id) => apiFetch(`/admin/media/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export default mediaService;
