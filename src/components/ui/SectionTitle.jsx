export default function SectionTitle({ eyebrow, title, action, center = false, light = false }) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${center ? "justify-center text-center" : ""}`}>
      <div>
        {eyebrow && (
          <p className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${light ? "text-gold-300" : "text-brand-600"} ${center ? "justify-center" : ""}`}>
            <span className="h-px w-8 bg-gold-400" /> {eyebrow}
          </p>
        )}
        <h2 className={`font-display text-3xl font-bold sm:text-4xl ${light ? "text-white" : "text-brand-900"}`}>{title}</h2>
      </div>
      {action}
    </div>
  );
}
