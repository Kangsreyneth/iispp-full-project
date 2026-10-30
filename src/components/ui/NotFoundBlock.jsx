import { Link } from "react-router-dom";
import EmptyState from "./EmptyState";
import Button from "./Button";

export default function NotFoundBlock({ what = "page", to = "/", label = "Back to home" }) {
  return (
    <div className="container-page py-20">
      <EmptyState title={`This ${what} could not be found`} text="It may have been removed or is not published yet." action={<Button as={Link} to={to}>{label}</Button>} />
    </div>
  );
}
