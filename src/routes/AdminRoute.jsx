import { Navigate, Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/authService";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

/** Only approved admins get through. Other signed-in users see a waiting screen. */
export default function AdminRoute({ children }) {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) return <Spinner className="min-h-screen" />;
  if (!user) return <Navigate to="/admin" replace />;
  if (!isAdmin)
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 p-4">
        <div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow">
          <Clock className="mx-auto mb-3 h-10 w-10 text-amber-500" />
          <h1 className="font-display text-2xl font-bold text-brand-800">Waiting for approval</h1>
          <p className="mt-2 text-slate-600">
            {profile ? `Hi ${profile.displayName || profile.name}, your account has been created.` : "Your account has no profile yet."} An administrator must approve it before you can open the dashboard.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button as={Link} to="/" variant="outline">Back to website</Button>
            <Button onClick={async () => { await logout(); }}>Logout</Button>
          </div>
        </div>
      </div>
    );
  return children;
}
