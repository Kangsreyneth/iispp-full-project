import { Link2 } from "lucide-react";
import { Facebook } from "./BrandIcons";
import toast from "react-hot-toast";

export default function ShareBar({ title }) {
  const url = window.location.href;
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      Share:
      <button onClick={() => navigator.clipboard.writeText(url).then(() => toast.success("Link copied"))} className="flex items-center gap-1 rounded-full border px-3 py-1 hover:border-brand-600 hover:text-brand-700"><Link2 className="h-4 w-4" /> Copy link</button>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" aria-label={`Share ${title} on Facebook`} className="flex items-center gap-1 rounded-full border px-3 py-1 hover:border-brand-600 hover:text-brand-700"><Facebook className="h-4 w-4" /> Facebook</a>
    </div>
  );
}
