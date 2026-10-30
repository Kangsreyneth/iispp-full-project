import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import TextField from "@/components/forms/TextField";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { login, authError } from "@/services/authService";
import { isEmail } from "@/utils/validators";

export default function Login() {
  const { isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && isAdmin) return <Navigate to="/admin/dashboard" replace />;

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!isEmail(f.email)) return setError("Enter a valid email address.");
    if (!f.password) return setError("Enter your password.");
    setBusy(true);
    try { await login(f.email, f.password); nav("/admin/dashboard", { replace: true }); }
    catch (err) { setError(authError(err)); }
    finally { setBusy(false); }
  }

  return (
    <AuthLayout title="Staff sign in" subtitle="For authorized IISPP staff only." footer={<>Public website? <Link to="/" className="font-semibold text-brand-700 hover:underline">Return to IISPP</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        <TextField label="Email" icon={Mail} type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <TextField label="Password" icon={Lock} type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <div className="text-right"><Link to="/admin/forgot-password" className="text-sm text-brand-700 hover:underline">Forgot password?</Link></div>
        <Button type="submit" size="lg" loading={busy} className="w-full">Sign in</Button>
      </form>
    </AuthLayout>
  );
}
