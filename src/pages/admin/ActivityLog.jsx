import { useCallback, useEffect, useState } from "react";
import { Filter } from "lucide-react";
import toast from "react-hot-toast";
import DataTable from "@/components/tables/DataTable";
import Spinner from "@/components/ui/Spinner";
import { apiFetch } from "@/services/api/apiService";
import { formatDate } from "@/utils/format";

const columns = [
  { key: "actorName", label: "User", render: (row) => row.actorName || row.actorUid || "System" },
  { key: "action", label: "Action" },
  { key: "resourceType", label: "Module" },
  { key: "timestamp", label: "Date", render: (row) => formatDate(row.timestamp || row.createdAt, { dateStyle: "medium", timeStyle: "short" }) },
];

export default function ActivityLog() {
  const [rows, setRows] = useState(null);
  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [user, setUser] = useState("");

  const load = useCallback(async () => {
    const query = new URLSearchParams({ limit: "50" });
    if (module) query.set("resourceType", module);
    if (action) query.set("action", action);
    if (user.trim()) query.set("actorUid", user.trim());
    setRows(null);
    try { setRows((await apiFetch(`/admin/activity-logs?${query}`))?.data || []); }
    catch (error) { toast.error(error.message || "Could not load activity"); setRows([]); }
  }, [module, action, user]);

  useEffect(() => { load(); }, [load]);

  const inputClass = "min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
  return <div className="space-y-5">
    <div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">Governance</p><h2 className="mt-1 font-display text-3xl font-bold text-brand-900">Activity log</h2><p className="text-sm text-slate-500">Review recent content and account changes.</p></div>
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="grid gap-1 text-xs font-semibold text-slate-500">Module<select value={module} onChange={(event) => setModule(event.target.value)} className={inputClass}><option value="">All modules</option>{["pages", "news", "events", "programs", "departments", "research", "publications", "media", "users", "messages", "settings", "navigation", "homepageSections"].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="grid gap-1 text-xs font-semibold text-slate-500">Action<select value={action} onChange={(event) => setAction(event.target.value)} className={inputClass}><option value="">All actions</option>{["create", "update", "delete", "reorder", "login"].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="grid gap-1 text-xs font-semibold text-slate-500">User ID<input value={user} onChange={(event) => setUser(event.target.value)} placeholder="Filter by user ID" className={inputClass} /></label>
      <span className="inline-flex items-center gap-1.5 pb-2 text-xs text-slate-400"><Filter className="h-3.5 w-3.5" />Updates as filters change</span>
    </div>
    {rows === null ? <Spinner /> : <DataTable columns={columns} rows={rows} searchKeys={["actorName", "actorUid", "action", "resourceType"]} emptyTitle="No activity found" />}
  </div>;
}
