import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import seal from "@/assets/logos/seal.png";
import CoverImage from "@/components/ui/CoverImage";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";
import { truncate } from "@/utils/format";

export default function AboutSection() {
  const { t } = useLang();
  const { settings: s } = useSettings();
  return (
    <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
      <div className="relative mx-auto w-full max-w-md">
        <div className="absolute -bottom-4 -left-4 h-full w-full rounded-2xl border-2 border-gold-400" />
        <div className="group relative overflow-hidden rounded-2xl shadow-xl"><CoverImage src={s.aboutImage} alt="About IISPP" ratio="aspect-[4/5]" /></div>
        <img src={seal} alt="" className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full border-4 border-white bg-white shadow-lg" />
      </div>
      <div>
        <SectionTitle eyebrow={t("about")} title={s.aboutTitle} />
        <p className="-mt-2 mb-6 leading-relaxed text-slate-600">{truncate(s.aboutText, 420)}</p>
        {(s.mission || s.vision) && (
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {s.mission && <div className="rounded-lg border-l-4 border-brand-600 bg-brand-50 p-4"><p className="font-display font-bold text-brand-800">Mission</p><p className="mt-1 text-sm text-slate-600">{truncate(s.mission, 110)}</p></div>}
            {s.vision && <div className="rounded-lg border-l-4 border-gold-500 bg-slate-50 p-4"><p className="font-display font-bold text-brand-800">Vision</p><p className="mt-1 text-sm text-slate-600">{truncate(s.vision, 110)}</p></div>}
          </div>
        )}
        <Button as={Link} to="/about">{t("learnMore")} <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </section>
  );
}
