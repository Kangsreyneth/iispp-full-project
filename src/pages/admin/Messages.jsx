import { useCallback, useEffect, useState } from "react";
import { Eye, Trash2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import DataTable from "@/components/tables/DataTable";
import messageService from "@/services/messageService";
import { formatDate } from "@/utils/format";

const columns = [
  { key: "name", label: "From" }, { key: "email", label: "Email" }, { key: "subject", label: "Subject" },
  { key: "createdAt", label: "Date", type: "date" }, { key: "status", label: "Status", type: "badge" },
];

export default function Messages() {
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(() => messageService.listAll().then(setRows).catch(() => { toast.error("Could not load messages"); setRows([]); }), []);
  useEffect(() => { load(); }, [load]);

  async function view(m) {
    setOpen(m);
    if (m.status === "new") { try { await messageService.update(m.id, { status: "read" }); load(); } catch { /* ignore */ } }
  }

  return (
    <div className="space-y-5">
      <div><h1 className="font-display text-3xl font-bold text-brand-800">Messages</h1><p className="text-sm text-slate-500">Messages sent from the website contact form.</p></div>
      {rows === null ? <Spinner /> : (
        <DataTable columns={columns} rows={rows} searchKeys={["name", "email", "subject", "message"]} emptyTitle="Inbox is empty"
          actions={(m) => (
            <div className="flex justify-end">
              <button onClick={() => view(m)} aria-label="Read" title="Read" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700"><Eye className="h-4 w-4" /></button>
              <button onClick={() => setDeleting(m)} aria-label="Delete" title="Delete" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          )} />
      )}
      {open && (
        <Modal title={open.subject || "Message"} onClose={() => setOpen(null)}>
          <p className="text-sm text-slate-500">From <b>{open.name}</b> ({open.email}) · {formatDate(open.createdAt, { day: "numeric", month: "long", year: "numeric" })}</p>
          <p className="prose-body mt-4 rounded-lg bg-slate-50 p-4">{open.message}</p>
          <div className="mt-5 flex justify-end"><Button as="a" icon={Mail} href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject || "Your message")}`}>Reply by email</Button></div>
        </Modal>
      )}
      {deleting && <ConfirmDialog title="Delete message?" text={`The message from ${deleting.name} will be removed.`} onClose={() => setDeleting(null)}
        onConfirm={async () => { await messageService.remove(deleting.id); toast.success("Deleted"); setDeleting(null); load(); }} />}
    </div>
  );
}
