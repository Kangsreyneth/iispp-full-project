import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import seal from "@/assets/logos/seal.png";

export default function NotFound() {
  return (
    <div className="container-page grid place-items-center py-24 text-center">
      <img src={seal} alt="" className="mb-4 h-24 w-24 opacity-80" />
      <p className="font-display text-6xl font-bold text-brand-700">404</p>
      <p className="mt-2 text-lg text-slate-600">We could not find that page.</p>
      <Button as={Link} to="/" className="mt-6">Back to home</Button>
    </div>
  );
}
