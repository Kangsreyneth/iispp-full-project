import { MapPin, Phone, Mail } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import MapEmbed from "@/components/ui/MapEmbed";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";

export default function VisitUs() {
  const { t } = useLang();
  const { settings: s } = useSettings();
  return (
    <section className="container-page grid items-center gap-10 py-20 lg:grid-cols-[1fr_1.3fr]">
      <div>
        <SectionTitle eyebrow={t("contact")} title={t("visitUs")} />
        <ul className="-mt-2 space-y-4 text-slate-600">
          <li className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-600" /> {s.address}</li>
          <li className="flex gap-3"><Phone className="mt-1 h-5 w-5 shrink-0 text-brand-600" /> {s.phone}</li>
          <li className="flex gap-3"><Mail className="mt-1 h-5 w-5 shrink-0 text-brand-600" /> {s.email}</li>
        </ul>
      </div>
      <MapEmbed lat={s.lat} lng={s.lng} label={t("directions")} />
    </section>
  );
}
