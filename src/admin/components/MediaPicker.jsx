import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Modal from "@/components/ui/Modal";
import mediaService from "@/services/mediaService";

export default function MediaPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      mediaService.listAll(100, search).then((result) => { if (active) setItems(result); }).catch(() => { if (active) setItems([]); });
    }, 180);
    return () => { active = false; window.clearTimeout(timer); };
  }, [search]);

  return (
    <Modal title="Choose from media library" onClose={onClose} size="max-w-5xl">
      <label className="relative mb-4 block max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><span className="sr-only">Search media</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search files" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" /></label>
      {items === null ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 10 }, (_, index) => <div key={index} className="aspect-square animate-pulse rounded-lg bg-slate-100" />)}</div> : items.length ? (
        <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => <button type="button" key={item.id} onClick={() => onSelect({ url: item.downloadUrl, mediaId: item.id })} className="overflow-hidden rounded-lg border border-slate-200 text-left transition hover:border-brand-500 hover:ring-2 hover:ring-brand-100">
            <img src={item.downloadUrl} alt={item.altText?.en || item.fileName || ""} className="aspect-square w-full bg-slate-100 object-cover" loading="lazy" />
            <span className="block truncate px-2 py-1.5 text-xs text-slate-600">{item.fileName}</span>
          </button>)}
        </div>
      ) : <p className="rounded-lg bg-slate-50 p-8 text-center text-sm text-slate-500">No media found.</p>}
    </Modal>
  );
}
