import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-brand-700 text-white hover:bg-brand-800 shadow-sm",
  outline: "border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-white",
  ghost: "text-brand-700 hover:bg-brand-50",
  light: "bg-white text-brand-800 hover:bg-brand-50 shadow-sm",
  glass: "border border-white/40 text-white hover:bg-white hover:text-brand-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3 text-base" };

/** Use as={Link} to="/path" for links. */
export default function Button({ as: Tag = "button", variant = "primary", size = "md", loading, icon: Icon, className = "", children, ...props }) {
  const isButton = Tag === "button";
  return (
    <Tag
      {...(isButton ? { type: props.type || "button", disabled: loading || props.disabled } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </Tag>
  );
}
