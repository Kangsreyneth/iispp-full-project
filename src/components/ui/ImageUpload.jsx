import { useRef, useState } from "react";
import { ImagePlus, Trash2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { uploadImage } from "@/services/storageService";
import MediaPicker from "@/admin/components/MediaPicker";

/** Drag/drop, upload, or select an existing file from the admin media library. */
export default function ImageUpload({ value, onChange, folder = "misc", onBusy, ratio = "aspect-[16/10]" }) {
  const input = useRef(null);
  const [progress, setProgress] = useState(null);
  const [drag, setDrag] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const imageUrl = typeof value === "string" ? value : value?.url;

  async function handle(file) {
    if (!file) return;
    setProgress(0);
    onBusy?.(1);
    try { onChange(await uploadImage(file, folder, setProgress)); }
    catch (error) { toast.error(error.message || "Upload failed"); }
    finally { setProgress(null); onBusy?.(-1); if (input.current) input.current.value = ""; }
  }

  return (
    <div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(event) => handle(event.target.files?.[0])} />
      {imageUrl ? (
        <div className={`group relative overflow-hidden rounded-lg border ${ratio}`}>
          <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2 bg-black/50 p-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
            <button type="button" onClick={() => input.current?.click()} className="flex items-center gap-1 rounded bg-white px-3 py-1.5 text-sm font-medium"><RefreshCw className="h-4 w-4" /> Replace</button>
            <button type="button" onClick={() => setPickerOpen(true)} className="rounded bg-white px-3 py-1.5 text-sm font-medium">Library</button>
            <button type="button" onClick={() => onChange("")} className="flex items-center gap-1 rounded bg-white px-3 py-1.5 text-sm font-medium text-red-600"><Trash2 className="h-4 w-4" /> Remove</button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => { event.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(event) => { event.preventDefault(); setDrag(false); handle(event.dataTransfer.files?.[0]); }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${drag ? "border-brand-600 bg-brand-50" : "border-slate-300 bg-slate-50"}`}
        >
          <ImagePlus className="h-8 w-8 text-brand-600" />
          <span className="text-sm font-medium text-slate-700">Drag & drop an image here</span>
          <span className="text-xs text-slate-500">JPG, PNG or WebP · max 5 MB</span>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => input.current?.click()} className="rounded-md bg-brand-700 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-800">Upload image</button>
            <button type="button" onClick={() => setPickerOpen(true)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-brand-400">Choose from library</button>
          </div>
        </div>
      )}
      {progress !== null && <div className="mt-2" role="progressbar" aria-valuenow={progress}><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-1 text-xs text-slate-500">Uploading… {progress}%</p></div>}
      {pickerOpen && <MediaPicker onClose={() => setPickerOpen(false)} onSelect={(media) => { onChange(media); setPickerOpen(false); }} />}
    </div>
  );
}
