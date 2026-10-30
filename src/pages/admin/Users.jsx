import { useCallback, useEffect, useState } from "react";
import { UserCheck, UserX } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/tables/DataTable";
import { useAuth } from "@/hooks/useAuth";
import userService from "@/services/userService";

const columns = [
  { key: "name", label: "Name" }, { key: "email", label: "Email" },
  { key: "role", label: "Role", type: "badge" }, { key: "status", label: "Status", type: "badge" },
  { key: "createdAt", label: "Joined", type: "date" },
];

/** New sign-ups arrive as "pending". Approving makes them an admin. */
export default function Users() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);
  const load = useCallback(() => userService.listAll().then(setRows).catch(() => { toast.error("Could not load users"); setRows([]); }), []);
  useEffect(() => { load(); }, [load]);

  async function setAccess(u, active) {
    try {
      if (active) {
        await userService.update(u.id, { role: "editor" });
        await userService.update(u.id, { status: "active" });
      } else {
        await userService.update(u.id, { status: "disabled" });
      }
      toast.success(active ? `${u.name} now has editor access` : `${u.name}'s access was disabled`);
      load();
    } catch { toast.error("Could not update this user"); }
  }

  return (
    <div className="space-y-5">
      <div><h1 className="font-display text-3xl font-bold text-brand-800">Users</h1><p className="text-sm text-slate-500">Approve requests as editors or disable existing access.</p></div>
      {rows === null ? <Spinner /> : (
        <DataTable columns={columns} rows={rows} searchKeys={["name", "email"]}
          actions={(u) => u.id === user.uid ? <span className="text-xs text-slate-400">You</span> : (
            <div className="flex justify-end gap-1">
              {u.status === "active"
                ? <button onClick={() => setAccess(u, false)} title="Disable access" aria-label="Disable access" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-amber-600"><UserX className="h-4 w-4" /></button>
                : <button onClick={() => setAccess(u, true)} title="Approve as editor" aria-label="Approve as editor" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-600"><UserCheck className="h-4 w-4" /></button>}
            </div>
          )} />
      )}
    </div>
  );
}
