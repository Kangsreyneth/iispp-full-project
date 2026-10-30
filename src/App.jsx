import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import { LangProvider } from "@/hooks/useLang";
import { SettingsProvider } from "@/hooks/useSettings";
import AppRoutes from "@/routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <SettingsProvider>
          <AuthProvider>
            <AppRoutes />
            <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
          </AuthProvider>
        </SettingsProvider>
      </LangProvider>
    </BrowserRouter>
  );
}
