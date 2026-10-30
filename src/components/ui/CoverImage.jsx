import seal from "@/assets/logos/seal.png";

/** Image slot used everywhere. Without a photo it shows the IISPP seal on a maroon gradient. */
export default function CoverImage({ src, alt = "", ratio = "aspect-[16/10]", className = "", zoom = true, shade = true, children }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-800 to-brand-900 ${ratio} ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${zoom ? "group-hover:scale-110" : ""}`} />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <img src={seal} alt="" className="h-1/2 max-h-44 opacity-30 transition duration-700 group-hover:scale-110" />
        </div>
      )}
      {shade && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />}
      {children}
    </div>
  );
}
