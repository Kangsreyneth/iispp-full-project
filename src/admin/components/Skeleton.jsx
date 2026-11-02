export default function Skeleton({ className = "", rounded = "rounded-lg" }) {
  return <div aria-hidden="true" className={`animate-pulse bg-slate-200 ${rounded} ${className}`} />;
}
