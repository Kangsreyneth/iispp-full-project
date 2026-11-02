import { useCallback, useEffect, useMemo, useState } from "react";
import { UserCheck, UserX, Shield, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/tables/DataTable";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import userService from "@/services/userService";

const columns = [
  { key: "name", label: "Name" }, { key: "email", label: "Email" },
  { key: "role", label: "Role", type: "badge" }, { key: "status", label: "Status", type: "badge" },
  { key: "createdAt", label: "Joined", type: "date" },
];

function can(profile, permission) {
  return profile?.role === "super_admin" || (profile?.permissions || []).some((granted) => granted === "*" || granted === permission || (granted.endsWith(".*") && permission.startsWith(granted.slice(0, -1))));
}

export default function Users() {
  const { user, profile } = useAuth();
  const [rows, setRows] = useState(null);
  const [roles, setRoles] = useState([]);
  const [managing, setManaging] = useState(null);
  const [inviting, setInviting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [inviteData, setInviteData] = useState({ displayName: "", email: "", role: "" });
  const [saving, setSaving] = useState(false);
  const canManage = can(profile, "users.manage");

  const load = useCallback(() => userService.listAll().then(setRows).catch((error) => { toast.error(error.message || "Could not load users"); setRows([]); }), []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!can(profile, "users.view")) return;
    userService.roles().then((items) => setRoles(items || [])).catch(() => setRoles([]));
  }, [profile?.role, profile?.permissions?.join(",")]);

  const assignableRoles = useMemo(() => roles.filter((role) => role.assignable), [roles]);
  const columnsWithPending = useMemo(() => columns, []);

  function openManage(row) {
    setManaging(row);
    setSelectedRole(row.role === "admin" ? "administrator" : row.role || assignableRoles[0]?.key || "");
  }

  async function saveUser(event) {
    event.preventDefault();
    if (!managing || !selectedRole) return;
    setSaving(true);
    try {
      const changes = managing.status === "pending" ? { role: selectedRole, status: "active" } : { role: selectedRole };
      await userService.update(managing.id, changes);
      toast.success(managing.status === "pending" ? `${managing.name} approved` : "User role updated");
      setManaging(null);
      await load();
    } catch (error) { toast.error(error.message || "Could not update this user"); }
    finally { setSaving(false); }
  }

  async function disableUser(row, rejected = false) {
    setSaving(true);
    try {
      await userService.update(row.id, { status: "disabled" });
      toast.success(rejected ? "Request rejected and access disabled" : `${row.name}'s access was disabled`);
      setManaging(null);
      await load();
    } catch (error) { toast.error(error.message || "Could not update this user"); }
    finally { setSaving(false); }
  }

  async function activateUser(row) {
    setSaving(true);
    try {
      await userService.update(row.id, { status: "active" });
      toast.success(`${row.name} activated`);
      setManaging(null);
      await load();
    } catch (error) { toast.error(error.message || "Could not activate this user"); }
    finally { setSaving(false); }
  }

  async function invite(event) {
    event.preventDefault();
    if (!inviteData.role) return toast.error("Choose an assignable role.");
    setSaving(true);
    try {
      await userService.invite(inviteData);
      toast.success("User invited");
      setInviting(false);
      setInviteData({ displayName: "", email: "", role: "" });
      await load();
    } catch (error) { toast.error(error.message || "Could not invite user"); }
    finally { setSaving(false); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">Administration</p><h2 className="mt-1 font-display text-3xl font-bold text-brand-900">Users and roles</h2><p className="text-sm text-slate-500">Review pending accounts and manage staff access.</p></div>
        {canManage && <Button icon={UserPlus} onClick={() => { setInviteData({ displayName: "", email: "", role: assignableRoles[0]?.key || "" }); setInviting(true); }}>Invite user</Button>}
      </div>
      {rows === null ? <Spinner /> : <DataTable columns={columnsWithPending} rows={rows} searchKeys={["name", "email", "role", "status"]} emptyTitle="No users found" emptyText="Accounts appear here after sign up or invitation."
        actions={(row) => row.id === user?.uid ? <span className="text-xs text-slate-400">You</span> : canManage ? <div className="flex justify-end gap-1">
          {row.status === "pending" ? <><button type="button" onClick={() => openManage(row)} title="Approve request" aria-label={`Approve ${row.name}`} className="rounded-md p-2 text-emerald-700 hover:bg-emerald-50"><UserCheck className="h-4 w-4" /></button><button type="button" onClick={() => disableUser(row, true)} title="Reject request" aria-label={`Reject ${row.name}`} className="rounded-md p-2 text-red-600 hover:bg-red-50"><UserX className="h-4 w-4" /></button></> : <button type="button" onClick={() => openManage(row)} title="Manage user" aria-label={`Manage ${row.name}`} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700"><Shield className="h-4 w-4" /></button>}
        </div> : null} />}

      {managing && <Modal title={managing.status === "pending" ? "Approve account" : `Manage ${managing.name}`} onClose={() => setManaging(null)}>
        <form onSubmit={saveUser} className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-3 text-sm"><p className="font-semibold text-slate-800">{managing.name}</p><p className="text-slate-500">{managing.email}</p></div>
          <label className="block text-sm font-medium text-slate-700">Role
            <select value={selectedRole} required onChange={(event) => setSelectedRole(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100">
              <option value="" disabled>Select a role</option>
              {roles.filter((role) => role.assignable || role.key === selectedRole).map((role) => <option key={role.key} value={role.key}>{role.label}</option>)}
            </select>
          </label>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
            <div>{managing.status === "pending" ? <Button type="button" variant="danger" loading={saving} onClick={() => disableUser(managing, true)} icon={UserX}>Reject</Button> : managing.status === "active" ? <Button type="button" variant="ghost" loading={saving} onClick={() => disableUser(managing)} icon={UserX}>Disable access</Button> : <Button type="button" variant="outline" loading={saving} onClick={() => activateUser(managing)} icon={UserCheck}>Activate</Button>}</div>
            <div className="flex gap-2"><Button type="button" variant="ghost" onClick={() => setManaging(null)}>Cancel</Button><Button type="submit" loading={saving} icon={UserCheck}>{managing.status === "pending" ? "Approve user" : "Save role"}</Button></div>
          </div>
        </form>
      </Modal>}

      {inviting && <Modal title="Invite a user" onClose={() => setInviting(false)}>
        <form onSubmit={invite} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Full name<input required maxLength={160} value={inviteData.displayName} onChange={(event) => setInviteData((value) => ({ ...value, displayName: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block text-sm font-medium text-slate-700">Email<input required type="email" value={inviteData.email} onChange={(event) => setInviteData((value) => ({ ...value, email: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block text-sm font-medium text-slate-700">Role<select required value={inviteData.role} onChange={(event) => setInviteData((value) => ({ ...value, role: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"><option value="" disabled>Select a role</option>{assignableRoles.map((role) => <option key={role.key} value={role.key}>{role.label}</option>)}</select></label>
          <div className="flex justify-end gap-2 border-t pt-4"><Button type="button" variant="ghost" onClick={() => setInviting(false)}>Cancel</Button><Button type="submit" loading={saving}>Send invitation</Button></div>
        </form>
      </Modal>}
    </div>
  );
}
