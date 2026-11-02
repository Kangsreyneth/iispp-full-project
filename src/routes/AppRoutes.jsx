import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import AdminRoute from "./AdminRoute";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";

import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Academics from "@/pages/public/Academics";
import ProgramDetail from "@/pages/public/ProgramDetail";
import News from "@/pages/public/News";
import NewsDetail from "@/pages/public/NewsDetail";
import Events from "@/pages/public/Events";
import EventDetail from "@/pages/public/EventDetail";
import Contact from "@/pages/public/Contact";
import Centers from "@/pages/public/Centers";
import CenterDetail from "@/pages/public/CenterDetail";
import SearchPage from "@/pages/public/SearchPage";
import NotFound from "@/pages/public/NotFound";
import Faculties from "@/pages/public/academics/Faculties";
import FacultyDetail from "@/pages/public/academics/FacultyDetail";
import Admissions from "@/pages/public/admissions/Admissions";
import Research from "@/pages/public/Research";

import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";

import Dashboard from "@/pages/admin/Dashboard";
import NewsAdmin from "@/pages/admin/NewsAdmin";
import EventsAdmin from "@/pages/admin/EventsAdmin";
import ProgramsAdmin from "@/pages/admin/ProgramsAdmin";
import FacultiesAdmin from "@/pages/admin/FacultiesAdmin";
import Messages from "@/pages/admin/Messages";
import Users from "@/pages/admin/Users";
import Settings from "@/pages/admin/Settings";
import Profile from "@/pages/auth/Profile";
import AdminPermission from "./AdminPermission";
import PagesAdmin from "@/pages/admin/PagesAdmin";
import MediaAdmin from "@/pages/admin/MediaAdmin";
import ResearchAdmin from "@/pages/admin/ResearchAdmin";
import PublicationsAdmin from "@/pages/admin/PublicationsAdmin";
import NavigationAdmin from "@/pages/admin/NavigationAdmin";
import BannerSlidesAdmin from "@/pages/admin/BannerSlidesAdmin";
import ActivityLog from "@/pages/admin/ActivityLog";

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public website: no login needed */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="program" element={<Academics />} />
          <Route path="department" element={<Faculties />} />
          <Route path="academics" element={<Academics />} />
          <Route path="academics/:id" element={<ProgramDetail />} />
          <Route path="faculty" element={<Faculties />} />
          <Route path="faculty/:id" element={<FacultyDetail />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="research" element={<Research />} />
          <Route path="centers" element={<Centers />} />
          <Route path="centers/:slug" element={<CenterDetail />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Staff authentication stays outside both public and protected layouts. */}
        <Route path="/admin">
          <Route index element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />

          {/* Admin portal: Firebase-authenticated, active staff only. */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pages" element={<AdminPermission permission="pages.view"><PagesAdmin /></AdminPermission>} />
            <Route path="news" element={<AdminPermission permission="news.view"><NewsAdmin /></AdminPermission>} />
            <Route path="events" element={<AdminPermission permission="events.view"><EventsAdmin /></AdminPermission>} />
            <Route path="programs" element={<AdminPermission permission="programs.view"><ProgramsAdmin /></AdminPermission>} />
            <Route path="faculties" element={<AdminPermission permission="departments.view"><FacultiesAdmin /></AdminPermission>} />
            <Route path="media" element={<AdminPermission permission="media.view"><MediaAdmin /></AdminPermission>} />
            <Route path="research" element={<AdminPermission permission="research.view"><ResearchAdmin /></AdminPermission>} />
            <Route path="publications" element={<AdminPermission permission="publications.view"><PublicationsAdmin /></AdminPermission>} />
            <Route path="navigation" element={<AdminPermission permission="navigation.manage"><NavigationAdmin /></AdminPermission>} />
            <Route path="home-content" element={<AdminPermission permission="homepage.manage"><BannerSlidesAdmin /></AdminPermission>} />
            <Route path="messages" element={<AdminPermission permission="messages.view"><Messages /></AdminPermission>} />
            <Route path="activity" element={<AdminPermission permission="audit.view"><ActivityLog /></AdminPermission>} />
            <Route path="users" element={<AdminPermission permission="users.view"><Users /></AdminPermission>} />
            <Route path="settings" element={<AdminPermission permission="settings.manage"><Settings /></AdminPermission>} />
          </Route>
        </Route>
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </>
  );
}
