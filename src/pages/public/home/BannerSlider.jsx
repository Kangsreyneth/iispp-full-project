import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";
import { publicApiFetch } from "@/services/api/apiService";
import campusImage from "@/assets/images/campus.png";
import instituteImage from "@/assets/images/IISPP1.png";
import researchImage from "@/assets/images/research1.png";

function imageUrl(value) {
  return typeof value === "string" ? value : value?.url || value?.downloadUrl || "";
}

function localized(value, lang) {
  if (typeof value === "string") return value;
  return value?.[lang] || value?.en || value?.km || "";
}

export default function BannerSlider() {
  const { lang, t } = useLang();
  const { settings } = useSettings();
  const [cmsSlides, setCmsSlides] = useState([]);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    let activeRequest = true;
    publicApiFetch(`/public/homepage?lang=${lang}`, { cache: "no-store" })
      .then((response) => {
        if (activeRequest) setCmsSlides((response?.data || []).filter((section) => section.type === "hero"));
      })
      .catch(() => { if (activeRequest) setCmsSlides([]); });
    return () => { activeRequest = false; };
  }, [lang]);

  const defaults = [
    { image: campusImage, title: t("aboutIispp"), subtitle: t("academicsIntro"), buttonText: t("exploreAcademics"), link: "/academics", alt: "IISPP campus" },
    { image: instituteImage, title: t("academics"), subtitle: t("academicsIntro"), buttonText: t("exploreAcademics"), link: "/academics", alt: "IISPP academic programs" },
    { image: researchImage, title: t("research"), subtitle: t("researchIntro"), buttonText: t("discoverResearch"), link: "/research", alt: "IISPP research" },
  ];

  const cmsConfigured = cmsSlides.map((section) => {
    const button = section.settings?.buttons?.[0];
    return {
      image: imageUrl(section.settings?.backgroundImage),
      title: section.content?.heading,
      subtitle: section.content?.subheading,
      buttonText: button?.label,
      link: button?.url,
      alt: section.settings?.backgroundImage?.altText,
    };
  }).filter((slide) => slide.image);

  const configured = [
    ...cmsConfigured,
    ...(cmsConfigured.length ? [] : [
    ...(settings.heroImage ? [{ image: settings.heroImage, title: settings.heroTitle, subtitle: settings.heroSubtitle }] : []),
    ...(Array.isArray(settings.heroSlides) ? settings.heroSlides : []),
    ]),
  ].filter((slide) => imageUrl(slide?.image)).slice(0, 5);

  const slides = (configured.length ? configured : defaults).map((slide, index) => {
    const fallback = defaults[index % defaults.length];
    return {
      image: imageUrl(slide.image),
      title: localized(slide.title, lang) || (index === 0 ? localized(settings.heroTitle, lang) : "") || fallback.title,
      subtitle: localized(slide.subtitle, lang) || (index === 0 ? localized(settings.heroSubtitle, lang) : "") || fallback.subtitle,
      buttonText: localized(slide.buttonText, lang) || fallback.buttonText,
      link: slide.link || fallback.link,
      alt: localized(slide.alt, lang) || fallback.alt,
    };
  });

  // Keep at least three slides when the CMS has only a hero image or one custom slide.
  for (const fallback of defaults) {
    if (slides.length >= 3) break;
    if (!slides.some((slide) => slide.image === fallback.image)) slides.push(fallback);
  }

  const current = slides[active] || slides[0];
  const move = (step) => setActive((index) => (index + step + slides.length) % slides.length);

  useEffect(() => {
    setActive((index) => Math.min(index, slides.length - 1));
  }, [slides.length]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || hovered || reducedMotion) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [active, hovered, reducedMotion, slides.length]);

  return (
    <>
      <link rel="preload" as="image" href={slides[0].image} fetchPriority="high" />
      <section
        className="relative isolate flex h-[92vh] min-h-[600px] w-full items-center overflow-hidden bg-brand-950 text-white supports-[height:92svh]:h-[92svh] touch-pan-y"
        aria-label="IISPP homepage banner"
        aria-roledescription="carousel"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStartX.current == null) return;
          const delta = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 48) move(delta < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        {slides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt={index === active ? slide.alt : ""}
            aria-hidden={index !== active}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 motion-reduce:transition-none ${index === active ? "animate-ken-burns opacity-100 motion-reduce:animate-none" : "scale-100 opacity-0"}`}
            onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-[#3a0710]/85 via-[#5a0c1b]/35 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a0710]/40 via-transparent to-transparent" aria-hidden="true" />

        <div key={active} className="mx-auto w-full max-w-[1680px] px-4 lg:px-6">
          <div className="max-w-4xl">
            <h1 className="animate-banner-fade-up font-display text-4xl font-semibold leading-[1.12] sm:text-5xl lg:text-6xl xl:text-7xl motion-reduce:animate-none" style={{ animationDelay: "200ms" }}>
              {current.title}
            </h1>
            <p className="mt-5 max-w-3xl animate-banner-fade-up text-base leading-8 text-white/90 sm:text-lg motion-reduce:animate-none" style={{ animationDelay: "400ms" }}>
              {current.subtitle}
            </p>
            <div className="mt-8 animate-banner-fade-up motion-reduce:animate-none" style={{ animationDelay: "600ms" }}>
              {current.link.startsWith("/") ? (
                <Link to={current.link} className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-gold-300">
                  {current.buttonText}<ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <a href={current.link} className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-gold-300">
                  {current.buttonText}<ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" role="group" aria-label={lang === "km" ? "រុករកស្លាយ" : "Choose a banner slide"}>
              {slides.map((slide, index) => (
                <button
                  key={`${slide.image}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={lang === "km" ? `ទៅស្លាយទី ${index + 1}` : `Go to slide ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${index === active ? "w-10 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
                />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
