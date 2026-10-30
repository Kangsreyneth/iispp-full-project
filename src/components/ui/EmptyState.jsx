import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", text, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
      <Inbox className="mx-auto mb-3 h-9 w-9 text-slate-400" />
      <p className="font-semibold text-slate-700">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
