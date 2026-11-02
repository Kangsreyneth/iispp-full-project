import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/admin/components/Card";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import pageService from "@/services/pageService";
import { navigationAdminService } from "@/services/adminSiteService";

const emptyItem = { label: { en: "", km: "" }, pageId: "", externalUrl: "", parentId: "", order: 0, isVisible: true };
const labelText = (value) => typeof value === "string" ? value : value?.en || value?.km || "Untitled";

export default function NavigationAdmin() {
  const [items, setItems] = useState(null);
  const [pages, setPages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [menu, sitePages] = await Promise.all([navigationAdminService.list(), pageService.listAll(300)]);
      setItems(menu.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setPages(sitePages);
    } catch (error) { toast.error(error.message || "Could not load the navigation manager"); setItems([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  function startEdit(item = null) {
    const value = item || { ...emptyItem, order: (items?.length || 0) * 10 + 10 };
    setEditing({ ...value, label: { en: value.label?.en || "", km: value.label?.km || "" }, pageId: value.pageId || "", externalUrl: value.externalUrl || "", parentId: value.parentId || "" });
  }

  async function save(event) {
    event.preventDefault();
    if (Boolean(editing.pageId) === Boolean(editing.externalUrl)) return toast.error("Choose a page or enter an external URL.");
    setSaving(true);
    const payload = { ...editing, pageId: editing.pageId || null, externalUrl: editing.externalUrl || null, parentId: editing.parentId || null, order: Number(editing.order) || 0 };
    try {
      if (editing.id) await navigationAdminService.update(editing.id, payload);
      else await navigationAdminService.create(payload);
      toast.success(editing.id ? "Menu item updated" : "Menu item added");
      setEditing(null);
      await load();
    } catch (error) { toast.error(error.message || "Could not save the menu item"); }
    finally { setSaving(false); }
  }

  async function toggleVisible(item) {
    try { await navigationAdminService.update(item.id, { ...item, isVisible: !item.isVisible }); await load(); toast.success(item.isVisible ? "Menu item hidden" : "Menu item shown"); }
    catch (error) { toast.error(error.message || "Could not update visibility"); }
  }

  async function move(item, direction) {
    const sameLevel = items.filter((row) => (row.parentId || "") === (item.parentId || "")).sort((a, b) => (a.order || 0) - (b.order || 0));
    const index = sameLevel.findIndex((row) => row.id === item.id);
    const next = index + direction;
    if (next < 0 || next >= sameLevel.length) return;
    [sameLevel[index], sameLevel[next]] = [sameLevel[next], sameLevel[index]];
    const moved = new Map(sameLevel.map((row, order) => [row.id, order * 10 + 10]));
    const ordered = items.map((row) => ({ id: row.id, parentId: row.parentId || null, order: moved.has(row.id) ? moved.get(row.id) : row.order || 0 }));
    try { await navigationAdminService.reorder(ordered); await load(); }
    catch (error) { toast.error(error.message || "Could not reorder menu items"); }
  }

  async function remove() {
    try { await navigationAdminService.remove(deleting.id); toast.success("Menu item deleted"); setDeleting(null); await load(); }
    catch (error) { toast.error(error.message || "Move its child items before deleting it."); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">Site structure</p><h2 className="mt-1 font-display text-3xl font-bold text-brand-900">Navigation manager</h2><p className="text-sm text-slate-500">Edit the bilingual public menu and nested items.</p></div><Button icon={Plus} onClick={() => startEdit()}>Add menu item</Button></div>

      <Card title="Public menu" description="Use the arrows to change the order. Hidden items remain available here for future use.">
        {items === null ? <Spinner /> : items.length ? <ul className="divide-y divide-slate-100">
          {items.map((item, index) => {
            const parent = items.find((row) => row.id === item.parentId);
            const page = pages.find((row) => row.id === item.pageId);
            return <li key={item.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 flex-1 items-center gap-3" style={{ paddingLeft: item.parentId ? 28 : 0 }}>
                <span className="w-8 text-center text-xs text-slate-400">{item.order || index + 1}</span>
                <span className="min-w-0"><span className="block truncate font-semibold text-slate-800">{labelText(item.label)}</span><span className="block truncate text-xs text-slate-500">{item.label?.km ? `KH: ${item.label.km}` : "Khmer label missing"} · {parent ? `Under ${labelText(parent.label)}` : page ? `Page: ${labelText(page.title)}` : item.externalUrl}</span></span>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(item, -1)} title="Move up" aria-label={`Move ${labelText(item.label)} up`} className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(item, 1)} title="Move down" aria-label={`Move ${labelText(item.label)} down`} className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => toggleVisible(item)} title={item.isVisible ? "Hide" : "Show"} aria-label={`${item.isVisible ? "Hide" : "Show"} ${labelText(item.label)}`} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">{item.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                <button type="button" onClick={() => startEdit(item)} title="Edit" aria-label={`Edit ${labelText(item.label)}`} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => setDeleting(item)} title="Delete" aria-label={`Delete ${labelText(item.label)}`} className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>;
          })}
        </ul> : <EmptyState title="No menu items yet" text="Add a menu item to create the public navigation. The current website menu remains as a fallback until then." />}
      </Card>

      {editing && <Modal title={editing.id ? "Edit menu item" : "Add menu item"} onClose={() => setEditing(null)}>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">Label (English)<input required maxLength={80} value={editing.label.en} onChange={(event) => setEditing((item) => ({ ...item, label: { ...item.label, en: event.target.value } }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block text-sm font-medium text-slate-700">Label (Khmer)<input lang="km" maxLength={80} value={editing.label.km} onChange={(event) => setEditing((item) => ({ ...item, label: { ...item.label, km: event.target.value } }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 [font-family:'Noto_Sans_Khmer',sans-serif] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block text-sm font-medium text-slate-700">Link to page<select value={editing.pageId} onChange={(event) => setEditing((item) => ({ ...item, pageId: event.target.value, externalUrl: "" }))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"><option value="">Choose a page…</option>{pages.map((page) => <option key={page.id} value={page.id}>{labelText(page.title)}</option>)}</select></label>
          <label className="block text-sm font-medium text-slate-700">Or external/site URL<input type="url" value={editing.externalUrl} onChange={(event) => setEditing((item) => ({ ...item, externalUrl: event.target.value, pageId: "" }))} placeholder="https://… or /path" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="block text-sm font-medium text-slate-700">Parent item<select value={editing.parentId} onChange={(event) => setEditing((item) => ({ ...item, parentId: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"><option value="">Top level</option>{items.filter((item) => item.id !== editing.id).map((item) => <option key={item.id} value={item.id}>{labelText(item.label)}</option>)}</select></label>
          <label className="block text-sm font-medium text-slate-700">Order<input type="number" min="0" value={editing.order} onChange={(event) => setEditing((item) => ({ ...item, order: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
          <label className="col-span-full flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={!!editing.isVisible} onChange={(event) => setEditing((item) => ({ ...item, isVisible: event.target.checked }))} className="h-4 w-4 accent-brand-700" />Show in public navigation</label>
          <div className="col-span-full flex justify-end gap-2 border-t pt-4"><Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" loading={saving}>Save menu item</Button></div>
        </form>
      </Modal>}
      {deleting && <ConfirmDialog title="Delete this menu item?" text={`${labelText(deleting.label)} will be removed. Move its child items first.`} onConfirm={remove} onClose={() => setDeleting(null)} />}
    </div>
  );
}
