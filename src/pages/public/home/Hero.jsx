import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Newspaper,
  BookOpen,
  Pause,
  Play,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { useLang } from "@/hooks/useLang";
import { useSettings } from "@/hooks/useSettings";
import { BRAND } from "@/utils/constants";
import iisppImage from "@/assets/images/IISPP1.png";
import campusImage from "@/assets/images/campus.png";
import studentImage from "@/assets/images/student.png";
import researchImage from "@/assets/images/research1.png";

const AUTOPLAY_DELAY = 5000;

const DEFAULT_SLIDES = [
  {
    image: iisppImage,
    title: "Welcome to IISPP",
    subtitle: "Discover learning and academic excellence.",
  },
  {
    image: campusImage,
    title: "Explore Our Campus",
    subtitle: "Discover a vibrant learning environment.",
  },
  {
    image: studentImage,
    title: "Shape Your Future",
    subtitle: "Explore academic programs and opportunities.",
  },
  {
    image: researchImage,
    title: "Research and Innovation",
    subtitle: "Build knowledge through discovery.",
  },
];

export default function Hero() {
  const { t } = useLang();
  const { settings: s } = useSettings();

  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // Read banner slides from website settings.
  const configuredSlides = [
    ...(s?.heroImage
      ? [
          {
            image: s.heroImage,
            title: s.heroTitle,
            subtitle: s.heroSubtitle,
          },
        ]
      : []),
    ...(Array.isArray(s?.heroSlides) ? s.heroSlides : []),
  ].filter((slide) => slide?.image);

  // Use configured slides when there are at least two.
  // Otherwise, use default banners for autoplay.
  const slides =
    configuredSlides.length >= 2
      ? configuredSlides
      : configuredSlides.length === 1
        ? [configuredSlides[0], ...DEFAULT_SLIDES.slice(1)]
        : DEFAULT_SLIDES;

  const totalSlides = slides.length;
  const currentSlide = slides[activeSlide] ?? slides[0];

  useEffect(() => {
    setActiveSlide(0);
  }, [totalSlides]);

useEffect(() => {
  if (totalSlides <= 1) return;

  const timer = window.setInterval(() => {
    setActiveSlide((current) => (current + 1) % totalSlides);
  }, AUTOPLAY_DELAY);

  return () => window.clearInterval(timer);
}, [totalSlides]);


  const previousSlide = () => {
    setActiveSlide((current) => (current - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % totalSlides);
  };

  const quick = [
    [GraduationCap, t("programs"), "/academics"],
    [Newspaper, t("latestNews"), "/news"],
    [BookOpen, t("apply"), "/admissions"],
  ];

  return (
    <section
      className="relative isolate min-h-[560px] overflow-hidden bg-brand-950 text-white sm:min-h-[640px] lg:min-h-[700px]"
      aria-label="IISPP banner"
      // onMouseEnter={() => setPaused(true)}
      // onMouseLeave={() => setPaused(false)}
      // onFocusCapture={() => setPaused(true)}
      // onBlurCapture={(event) => {
      //   if (!event.currentTarget.contains(event.relatedTarget)) {
      //     setPaused(false);
      //   }
      // }}
    >
      {/* Banner images */}
      {slides.map((slide, index) => (
        <div
          key={`${slide.image}-${index}`}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover object-center"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
        </div>
      ))}

      {/* Dark overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-brand-950/20" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-950/70 via-transparent to-brand-950/10" />

      {/* Main content */}
      <div className="container-page relative z-20 flex min-h-[400px] flex-col justify-center py-12 sm:min-h-[460px] sm:py-16 lg:min-h-[520px] lg:py-20">
        <div key={activeSlide} className="max-w-3xl animate-fade-up">
          <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-300 sm:text-sm">
            <span className="h-px w-10 bg-gold-400" />
            {BRAND.parent}
          </p>

          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
            {currentSlide?.title || s?.heroTitle || "Welcome to IISPP"}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg lg:text-xl">
            {currentSlide?.subtitle ||
              s?.heroSubtitle ||
              "Discover learning and academic excellence."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/academics" variant="light" size="lg">
              {t("exploreProgram")}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button as={Link} to="/contact" variant="glass" size="lg">
              {t("contactUs")}
            </Button>
          </div>

          {/* Quick links */}
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {quick.map(([Icon, label, to]) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-md transition hover:border-white/50 hover:bg-white hover:text-brand-900"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/15 transition group-hover:bg-brand-100">
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0 flex-1 text-sm font-semibold">
                  {label}
                </span>

                <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Slider controls */}

      {/* Minimal centered slide indicators */}
      {totalSlides > 1 && (
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={`${slide.image}-dot-${index}`}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to banner ${index + 1}`}
              aria-current={index === activeSlide ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === activeSlide
                  ? "w-8 bg-white shadow-md"
                  : "w-2 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
