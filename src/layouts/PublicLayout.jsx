import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConfigBanner from "@/components/layout/ConfigBanner";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ConfigBanner />
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
