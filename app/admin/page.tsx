"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/firestore";
import { useAuth } from "@/lib/auth";
import {
  MdMiscellaneousServices,
  MdArticle,
  MdPhotoLibrary,
  MdBusinessCenter,
  MdEmail,
  MdHandshake,
  MdArrowForward,
} from "react-icons/md";

interface Stats {
  services: number;
  blogPosts: number;
  gallery: number;
  clientele: number;
  unreadMessages: number;
  unreadApplications: number;
}

export default function DashboardPage() {
  const { adminUser } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingStats(false));
  }, []);

  const cards = stats
    ? [
        {
          label: "Services",
          value: stats.services,
          icon: MdMiscellaneousServices,
          href: "/admin/services",
          color: "bg-blue-50 text-blue-700",
        },
        {
          label: "Blog Posts",
          value: stats.blogPosts,
          icon: MdArticle,
          href: "/admin/blog",
          color: "bg-indigo-50 text-indigo-700",
        },
        {
          label: "Gallery",
          value: stats.gallery,
          icon: MdPhotoLibrary,
          href: "/admin/gallery",
          color: "bg-emerald-50 text-emerald-700",
        },
        {
          label: "Clientele",
          value: stats.clientele,
          icon: MdBusinessCenter,
          href: "/admin/clientele",
          color: "bg-amber-50 text-amber-700",
        },
        {
          label: "Unread Messages",
          value: stats.unreadMessages,
          icon: MdEmail,
          href: "/admin/messages",
          color: "bg-red-50 text-red-700",
        },
        {
          label: "Reseller Apps",
          value: stats.unreadApplications,
          icon: MdHandshake,
          href: "/admin/messages",
          color: "bg-purple-50 text-purple-700",
        },
      ]
    : [];

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Welcome back{adminUser?.name ? `, ${adminUser.name}` : ""}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all content for the FMS Africa website from here.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {loadingStats
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="stat-card animate-pulse">
                <div className="h-4 bg-gray-200 w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 w-1/3" />
              </div>
            ))
          : cards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="stat-card hover:border-blue-300 transition-colors block"
              >
                <div className={`inline-flex p-2 mb-3 ${card.color}`}>
                  <card.icon size={18} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
              </Link>
            ))}
      </div>

      <div className="admin-card">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Edit Homepage", href: "/admin/homepage" },
            { label: "New Service", href: "/admin/services" },
            { label: "New Blog Post", href: "/admin/blog" },
            { label: "Manage Clientele", href: "/admin/clientele" },
            { label: "Menus & Links", href: "/admin/navigation" },
            { label: "Site Settings", href: "/admin/settings" },
            { label: "View Messages", href: "/admin/messages" },
            { label: "Import Seed Data", href: "/admin/seed" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="flex items-center justify-between px-3 py-2 border border-gray-200 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
            >
              <span>{l.label}</span>
              <MdArrowForward size={14} className="shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
