"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  MdDashboard,
  MdArticle,
  MdSettings,
  MdEmail,
  MdLogout,
  MdMenu,
  MdClose,
  MdSlideshow,
  MdBusiness,
  MdVerified,
  MdFavorite,
  MdTrendingUp,
  MdHandshake,
  MdContactMail,
  MdPrivacyTip,
  MdMiscellaneousServices,
  MdPhotoLibrary,
  MdBusinessCenter,
  MdMenuBook,
  MdOutlineGroups,
  MdCloudUpload,
} from "react-icons/md";

const navSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: MdDashboard },
      { href: "/admin/messages", label: "Messages", icon: MdEmail },
    ],
  },
  {
    label: "Website Pages",
    items: [
      { href: "/admin/homepage", label: "Homepage", icon: MdSlideshow },
      { href: "/admin/about", label: "About Us", icon: MdBusiness },
      { href: "/admin/accreditations", label: "Accreditations", icon: MdVerified },
      { href: "/admin/csr", label: "CSR", icon: MdFavorite },
      { href: "/admin/benefits", label: "Benefits", icon: MdTrendingUp },
      { href: "/admin/resellers", label: "Resellers / Partners", icon: MdHandshake },
      { href: "/admin/contact", label: "Contact", icon: MdContactMail },
      { href: "/admin/privacy", label: "Privacy Policy", icon: MdPrivacyTip },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/admin/services", label: "All Services", icon: MdMiscellaneousServices },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", label: "Blog Posts", icon: MdArticle },
      { href: "/admin/gallery", label: "Gallery", icon: MdPhotoLibrary },
      { href: "/admin/clientele", label: "Clientele", icon: MdBusinessCenter },
    ],
  },
  {
    label: "Site & Navigation",
    items: [
      { href: "/admin/navigation", label: "Menus & Links", icon: MdMenuBook },
      { href: "/admin/settings", label: "Site Settings", icon: MdSettings },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/admin/team", label: "Admin Team", icon: MdOutlineGroups },
      { href: "/admin/seed", label: "Import Seed Data", icon: MdCloudUpload },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, adminUser, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <p className="text-white text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  const Sidebar = () => (
    <div className="admin-sidebar flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-[#0B3D91] flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-bold">FMS</span>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-blue-300">
            FMS Africa
          </p>
          <p className="text-sm font-semibold text-white">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="nav-section-label">{section.label}</p>
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-700 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold uppercase">
              {(adminUser?.name || user.email || "A")[0]}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {adminUser?.name || "Admin"}
            </p>
            <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-gray-400 text-xs hover:text-white transition-colors w-full"
        >
          <MdLogout size={14} />
          Sign out
        </button>
      </div>
    </div>
  );

  const pageTitle =
    pathname
      .replace("/admin/", "")
      .replace("/admin", "Dashboard")
      .replace(/-/g, " ") || "Dashboard";

  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex flex-col admin-sidebar fixed left-0 top-0 h-full z-40 overflow-y-auto">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full z-40 lg:hidden transition-transform duration-300 overflow-y-auto admin-sidebar ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: 260 }}
      >
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col lg:ml-[260px]">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button
            className="lg:hidden p-1"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <MdMenu size={22} />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-700 capitalize">
              {pageTitle}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-gray-500 hidden sm:block">
              {user.email}
            </span>
            {adminUser?.role && (
              <span className="badge badge-blue">
                {adminUser.role.replace("_", " ")}
              </span>
            )}
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <MdClose size={18} className="text-transparent" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
