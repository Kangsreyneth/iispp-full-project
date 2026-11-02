import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, ImagePlus, Pencil, Search, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import mediaService from "@/services/mediaService";

function can(profile, permission) {
  return profile?.role === "super_admin" || (profile?.permissions || []).some((granted) => granted === "*" || granted === permission || (granted.endsWith(".*") && permission.startsWith(granted.slice(0, -1))));
}

function altText(value, lang) {
  return typeof value === "string" ? value : value?.[lang] || value?.en || "";
}

export default function MediaAdmin() {
  const { profile } = useAuth();
  const input = useRef(null);
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [altTextEn, setAltTextEn] = useState("");
  const [altTextKm, setAltTextKm] = useState("");
  const [dragging, setDragging] = useState(false);
  const canUpload = can(profile, "media.upload");
  const canUpdate = can(profile, "media.update");
  const canDelete = can(profile, "media.delete");

  const load = useCallback(async (search = query) => {
    setItems(null);
    try { setItems(await mediaService.listAll(300, search)); }
    catch (error) { toast.error(error.message || "Could not load media library"); setItems([]); }
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => { load(query); }, 180);
    return () => window.clearTimeout(timer);
  }, [load, query]);

  const filtered = useMemo(() => items || [], [items]);

  async function uploadFiles(files) {
    const selectedFiles = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    if (!selectedFiles.length) return;
    setUploading(true);
    let completed = 0;
    try {
      for (const file of selectedFiles) {
        await mediaService.upload(file, "library", (value) => setProgress(Math.round((completed + value / 100) / selectedFiles.length * 100)));
        completed += 1;
        setProgress(Math.round(completed / selectedFiles.length * 100));
      }
      toast.success(`${selectedFiles.length} image${selectedFiles.length === 1 ? "" : "s"} uploaded`);
      await load(query);
    } catch (error) {
      toast.error(error.message || "Upload failed");
      await load(query);
    } finally {
      setUploading(false);
      setProgress(0);
      if (input.current) input.current.value = "";
    }
  }

  function editAltText(item) {
    setEditing(item);
    setAltTextEn(altText(item.altText, "en"));
    setAltTextKm(altText(item.altText, "km"));
  }

  async function saveAltText(event) {
    event.preventDefault();
    try {
      await mediaService.updateAltText(editing.id, { en: altTextEn, km: altTextKm });
      toast.success("Image description updated");
      setEditing(null);
      await load(query);
    } catch (error) { toast.error(error.message || "Could not update image description"); }
  }

  async function copyUrl(item) {
    try { await navigator.clipboard.writeText(item.downloadUrl); toast.success("Image URL copied"); }
    catch { toast.error("Could not copy this URL"); }
  }

  async function remove() {
    try {
      await mediaService.remove(deleting.id);
      toast.success("Image deleted");
      setDeleting(null);
      await load(query);
    } catch (error) { toast.error(error.message || "Could not delete image. It may be in use."); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">Content tools</p><h2 className="mt-1 font-display text-3xl font-bold text-brand-900">Media library</h2><p className="mt-1 text-sm text-slate-500">Upload and reuse images across pages, programs, and posts.</p></div>
        {canUpload && <Button icon={ImagePlus} onClick={() => input.current?.click()} loading={uploading}>Upload images</Button>}
      </div>

      {canUpload && <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); uploadFiles(event.dataTransfer.files); }} className={`rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${dragging ? "border-brand-600 bg-brand-50" : "border-slate-300 bg-white"}`}>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={(event) => uploadFiles(event.target.files)} />
        <p className="font-semibold text-slate-700">Drop images here or <button type="button" onClick={() => input.current?.click()} className="text-brand-700 underline underline-offset-2">browse files</button></p>
        <p className="mt-1 text-xs text-slate-500">JPG, PNG, WebP or GIF · maximum 5 MB each</p>
        {uploading && <div className="mx-auto mt-4 max-w-sm"><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-brand-700 transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-1 text-xs text-slate-500">Uploading {progress}%</p></div>}
      </div>}

      <label className="relative block max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" /><span className="sr-only">Search media files</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search file names" className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>

      {items === null ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{Array.from({ length: 10 }, (_, index) => <div key={index} className="aspect-[4/3] animate-pulse rounded-xl bg-slate-200" />)}</div> : filtered.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => <article key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button type="button" onClick={() => setSelected(item)} className="block w-full overflow-hidden bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"><img src={item.downloadUrl} alt={altText(item.altText, "en")} loading="lazy" className="aspect-[4/3] w-full object-cover transition hover:scale-[1.02]" /></button>
            <div className="p-3"><p className="truncate text-sm font-semibold text-slate-800" title={item.fileName}>{item.fileName}</p><p className="mt-1 text-xs text-slate-500">{item.width} × {item.height} · {Math.max(1, Math.round((item.size || 0) / 1024))} KB</p><div className="mt-3 flex justify-end gap-1">
              <button type="button" onClick={() => copyUrl(item)} aria-label={`Copy URL for ${item.fileName}`} title="Copy URL" className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><Copy className="h-4 w-4" /></button>
              {canUpdate && <button type="button" onClick={() => editAltText(item)} aria-label={`Edit alt text for ${item.fileName}`} title="Edit alt text" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700"><Pencil className="h-4 w-4" /></button>}
              {canDelete && <button type="button" onClick={() => setDeleting(item)} aria-label={`Delete ${item.fileName}`} title="Delete" className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
            </div></div>
          </article>)}
        </div>
      ) : <EmptyState title="No media found" text={query ? "Try another file name." : "Upload an image to start your media library."} />}

      {selected && <Modal title={selected.fileName} onClose={() => setSelected(null)} size="max-w-4xl"><img src={selected.downloadUrl} alt={altText(selected.altText, "en")} className="mx-auto max-h-[65vh] max-w-full rounded-lg object-contain" /><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500"><span>{selected.mimeType} · {selected.width} × {selected.height}</span><div className="flex gap-2"><Button variant="outline" icon={Copy} onClick={() => copyUrl(selected)}>Copy URL</Button><Button variant="ghost" icon={X} onClick={() => setSelected(null)}>Close</Button></div></div></Modal>}

      {editing && <Modal title="Edit image description" onClose={() => setEditing(null)}><form onSubmit={saveAltText} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">English alt text<input value={altTextEn} onChange={(event) => setAltTextEn(event.target.value)} maxLength={200} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
        <label className="block text-sm font-medium text-slate-700">Khmer alt text<input value={altTextKm} onChange={(event) => setAltTextKm(event.target.value)} maxLength={200} lang="km" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm [font-family:'Noto_Sans_Khmer',sans-serif] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
        <div className="flex justify-end gap-2 border-t pt-4"><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit">Save descriptions</Button></div>
      </form></Modal>}

      {deleting && <ConfirmDialog title="Delete this image?" text={`${deleting.fileName} will be permanently removed. Images in use cannot be deleted.`} onClose={() => setDeleting(null)} onConfirm={remove} />}
    </div>
  );
}
