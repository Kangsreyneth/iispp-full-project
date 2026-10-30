import { isConfigured } from "@/services/firebase";

/** Shows only while the .env file is still empty. */
export default function ConfigBanner() {
  if (isConfigured) return null;
  return (
    <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-900" role="alert">
      Firebase is not configured yet. Copy <code>.env.example</code> to <code>.env</code>, fill in your keys, then restart <code>npm run dev</code>.
    </div>
  );
}
