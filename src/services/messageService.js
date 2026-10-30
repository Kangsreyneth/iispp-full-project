import { apiFetch, publicApiFetch } from "./api/apiService";

async function listAll(max = 300) {
  const rows = [];
  let cursor = "";
  do {
    const query = new URLSearchParams({ limit: String(Math.min(50, max - rows.length)) });
    if (cursor) query.set("cursor", cursor);
    const response = await apiFetch(`/admin/messages?${query}`);
    rows.push(...(response?.data || []));
    cursor = response?.meta?.nextCursor || "";
  } while (cursor && rows.length < max);
  return rows.slice(0, max);
}

const messageService = {
  col: "messages",
  create: (data) => publicApiFetch("/public/messages", { method: "POST", body: JSON.stringify(data) }),
  listAll,
  count: async (status) => (await listAll(1000)).filter((message) => !status || message.status === status).length,
  update: (id, data) => apiFetch(`/admin/messages/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/admin/messages/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export { messageService };
export default messageService;
