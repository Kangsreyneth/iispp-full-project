import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Spinner from "@/components/ui/Spinner";
import DataTable from "@/components/tables/DataTable";
import DynamicForm from "@/components/forms/DynamicForm";
import { useAuth } from "@/hooks/useAuth";

const iconBtn = "rounded-md p-2 text-slate-500 transition hover:bg-slate-100";

function can(profile, permission) {
  return profile?.role === "super_admin" || (profile?.permissions || []).some((granted) =>
    granted === "*" || granted === permission ||
    (granted.endsWith(".*") && permission.startsWith(granted.slice(0, -1)))
  );
}

/** One generic list + add/edit/delete screen, driven by a config from src/config/resources.js. */
export default function ResourcePage({ resource }) {
  const { title, singular, path, service, columns, fields, searchKeys } = resource;
  const { profile } = useAuth();
  const canCreate = can(profile, `${service.col}.create`);
  const canUpdate = can(profile, `${service.col}.update`);
  const canDelete = can(profile, `${service.col}.delete`);
  const canPublish = can(profile, `${service.col}.publish`);
  const formFields = fields.map((field) => field.name === "status" && !canPublish
    ? { ...field, options: ["draft"], default: "draft" }
    : field);
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, row = edit
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    try { setRows(await service.listAll()); }
    catch (e) { toast.error(e.code === "permission-denied" ? "You do not have permission to view this" : "Could not load data"); setRows([]); }
  }, [service]);
  useEffect(() => { setRows(null); load(); }, [load]);

  async function save(values) {
    if (editing.id) await service.update(editing.id, values);
    else await service.create(values);
    toast.success(editing.id ? "Changes saved" : `New ${singular} added`);
    setEditing(null);
    await load();
  }
  async function toggle(row) {
    const status = row.status === "published" ? "draft" : "published";
    try { await service.update(row.id, { status }); toast.success(status === "published" ? "Published" : "Moved to drafts"); load(); }
    catch { toast.error("Could not update status"); }
  }
  async function remove() {
    try {
      await service.remove(deleting.id);
      toast.success("Deleted");
      setDeleting(null);
      load();
    } catch { toast.error("Could not delete"); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-800">{title}</h1>
          <p className="text-sm text-slate-500">Changes appear on the public website straight away.</p>
        </div>
        {canCreate && <Button icon={Plus} onClick={() => setEditing({})}>Add {singular}</Button>}
      </div>

      {rows === null ? <Spinner /> : (
        <DataTable
          columns={columns}
          rows={rows}
          searchKeys={searchKeys}
          emptyTitle={`No ${title.toLowerCase()} yet`}
          emptyText={`Click “Add ${singular}” to create the first one.`}
          actions={(row) => (
            <div className="flex justify-end">
              {row.status === "published" && <Link to={`${path}/${row.slug || row.id}`} target="_blank" title="View on website" aria-label="View on website" className={iconBtn}><ExternalLink className="h-4 w-4" /></Link>}
              {canPublish && <button onClick={() => toggle(row)} title={row.status === "published" ? "Unpublish" : "Publish"} aria-label="Toggle publish" className={iconBtn}>{row.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
              {canUpdate && <button onClick={() => setEditing(row)} title="Edit" aria-label="Edit" className={`${iconBtn} hover:text-brand-700`}><Pencil className="h-4 w-4" /></button>}
              {canDelete && <button onClick={() => setDeleting(row)} title="Delete" aria-label="Delete" className={`${iconBtn} hover:text-red-600`}><Trash2 className="h-4 w-4" /></button>}
            </div>
          )}
        />
      )}

      {editing && (
        <Modal title={editing.id ? `Edit ${singular}` : `Add ${singular}`} onClose={() => setEditing(null)} size="max-w-3xl">
          <DynamicForm fields={formFields} initial={editing} onSubmit={save} onCancel={() => setEditing(null)} submitLabel={editing.id ? "Save changes" : "Create"} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog title={`Delete this ${singular}?`} text={`“${deleting.title || deleting.name}” will be removed from the website. This cannot be undone.`} onConfirm={remove} onClose={() => setDeleting(null)} />
      )}
    </div>
  );
}
