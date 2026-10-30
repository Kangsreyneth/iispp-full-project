import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/Spinner";
import DynamicForm from "@/components/forms/DynamicForm";
import { SETTINGS_FIELDS } from "@/config/resources";
import { settingsService } from "@/services/settingsService";
import { useSettings } from "@/hooks/useSettings";
import { DEFAULT_SETTINGS } from "@/utils/constants";

export default function Settings() {
  const { reload } = useSettings();
  const [initial, setInitial] = useState(null);
  useEffect(() => { settingsService.getAdmin().then((s) => setInitial({ ...DEFAULT_SETTINGS, ...s })).catch(() => setInitial(DEFAULT_SETTINGS)); }, []);

  async function save(values) {
    await settingsService.save(values);
    await reload();
    toast.success("Settings saved. The website is updated.");
  }

  if (!initial) return <Spinner />;
  return (
    <div className="space-y-5">
      <div><h1 className="font-display text-3xl font-bold text-brand-800">Site settings</h1><p className="text-sm text-slate-500">Home page text, photos, contact details and map.</p></div>
      <div className="rounded-xl border bg-white p-6 shadow-sm"><DynamicForm fields={SETTINGS_FIELDS} initial={initial} onSubmit={save} submitLabel="Save settings" /></div>
    </div>
  );
}
