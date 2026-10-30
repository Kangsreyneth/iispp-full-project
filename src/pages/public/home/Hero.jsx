import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";
import { BRAND } from "@/utils/constants";
import campusImage from "@/assets/images/campus.png";
import iisppImage from "@/assets/images/IISPP1.png";
import researchImage from "@/assets/images/research1.png";

const defaultSlides = [campusImage, iisppImage, researchImage].map((image) => ({ image }));

export default function Hero() {
  const { t } = useLang();
  const { settings } = useSettings();
  const configuredSlides = [
    ...(settings.heroImage ? [{ image: settings.heroImage }] : []),
    ...(Array.isArray(settings.heroSlides) ? settings.heroSlides : []),
  ].filter((slide) => slide?.image);
  const slides = configuredSlides.length ? configuredSlides : defaultSlides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const current = slides[active] || slides[0];
  const title = current?.title || settings.heroTitle || BRAND.name;
  const subtitle = current?.subtitle || settings.heroSubtitle || "Advancing knowledge, research and policy dialogue in Cambodia and beyond.";

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    setActive(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || paused || hovered || focused || reducedMotion) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, hovered, focused, reducedMotion]);

  const move = (step) => setActive((value) => (value + step + slides.length) % slides.length);

  return (
    <section
      className="relative isolate flex min-h-[580px] items-center overflow-hidden bg-brand-950 text-white sm:min-h-[640px] lg:min-h-[690px]"
      aria-label="IISPP introduction"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <img
        key={current.image}
        src={current.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
        onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
      />
      <div className="absolute inset-0 bg-[#16050d]/65" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#16050d]/50 via-transparent to-transparent" aria-hidden="true" />

      <div className="container-page relative z-10 grid items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.55fr)]">
        <div className="max-w-4xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 sm:text-sm">
            <span className="h-px w-10 bg-gold-400" />
            {BRAND.parent}
          </p>
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.12] sm:text-5xl lg:text-6xl xl:text-7xl">
            {title}
          </h1>
          <p lang="km" className="mt-5 max-w-3xl font-sans text-xl font-semibold leading-relaxed text-gold-300 sm:text-2xl">
            {t("heroKhmer")}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/academics" variant="light" size="lg">{t("exploreAcademics")} <ArrowRight className="h-4 w-4" /></Button>
            <Button as={Link} to="/research" variant="glass" size="lg">{t("discoverResearch")}</Button>
          </div>
        </div>

        <div className="hidden border-l border-white/35 pl-7 lg:block">
          <p className="font-display text-2xl leading-snug text-white">{BRAND.name}</p>
          <p className="mt-4 text-sm leading-6 text-white/75">{BRAND.parent}</p>
          {slides.length > 1 && <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</p>}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 sm:bottom-7 sm:right-8" aria-label="Banner controls">
          <button type="button" onClick={() => move(-1)} className="grid h-10 w-10 place-items-center border border-white/50 text-white transition hover:bg-white hover:text-brand-900" aria-label={t("previousSlide")}><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" onClick={() => setPaused((value) => !value)} className="grid h-10 w-10 place-items-center border border-white/50 text-white transition hover:bg-white hover:text-brand-900" aria-label={paused ? t("playSlides") : t("pauseSlides")}>{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button>
          <button type="button" onClick={() => move(1)} className="grid h-10 w-10 place-items-center border border-white/50 text-white transition hover:bg-white hover:text-brand-900" aria-label={t("nextSlide")}><ChevronRight className="h-5 w-5" /></button>
        </div>
      )}
    </section>
  );
}
