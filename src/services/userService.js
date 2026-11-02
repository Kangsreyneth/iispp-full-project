import { apiFetch } from "./api/apiService";

const normalize = (user) => ({
  ...user,
  id: user.id || user.uid,
  uid: user.uid || user.id,
  name: user.displayName || user.name || user.email || "User",
  role: user.role === "admin" ? "administrator" : user.role,
});

async function listAll(max = 300) {
  const rows = [];
  let cursor = "";
  do {
    const query = new URLSearchParams({ limit: String(Math.min(50, max - rows.length)) });
    if (cursor) query.set("cursor", cursor);
    const response = await apiFetch(`/admin/users?${query}`);
    rows.push(...(response?.data || []).map(normalize));
    cursor = response?.meta?.nextCursor || "";
  } while (cursor && rows.length < max);
  return rows.slice(0, max);
}

const userService = {
  col: "users",
  listAll,
  roles: async () => (await apiFetch("/admin/roles"))?.data || [],
  invite: async (values) => normalize((await apiFetch("/admin/users", { method: "POST", body: JSON.stringify(values) }))?.data),
  count: async (status) => (await listAll(1000)).filter((user) => !status || user.status === status).length,
  update: async (uid, changes) => {
    let response;
    if (changes.role) {
      const role = changes.role === "admin" ? "administrator" : changes.role;
      response = await apiFetch(`/admin/users/${encodeURIComponent(uid)}/role`, {
        method: "PUT", body: JSON.stringify({ role }),
      });
    }
    if (changes.status) {
      response = await apiFetch(`/admin/users/${encodeURIComponent(uid)}/status`, {
        method: "PUT", body: JSON.stringify({ status: changes.status }),
      });
    }
    return response?.data ? normalize(response.data) : response;
  },
};

export { userService };
export default userService;
