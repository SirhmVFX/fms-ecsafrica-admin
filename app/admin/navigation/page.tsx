"use client";

import { useEffect, useState } from "react";
import {
  getSiteSettings,
  saveSiteSettings,
  SiteSettings,
} from "@/lib/firestore";
import type { NavLink } from "@/lib/types";
import { MdAdd, MdDelete } from "react-icons/md";

type NavForm = {
  aboutLinks: NavLink[];
  primaryLinks: NavLink[];
  footerQuickLinks: NavLink[];
  footerPortalLinks: NavLink[];
  footerFeaturedProducts: NavLink[];
};

const empty: NavForm = {
  aboutLinks: [],
  primaryLinks: [],
  footerQuickLinks: [],
  footerPortalLinks: [],
  footerFeaturedProducts: [],
};

const SECTIONS: { key: keyof NavForm; title: string; hint: string }[] = [
  {
    key: "aboutLinks",
    title: "About Links",
    hint: "Dropdown / about menu items",
  },
  {
    key: "primaryLinks",
    title: "Primary Links",
    hint: "Main navigation links",
  },
  {
    key: "footerQuickLinks",
    title: "Footer Quick Links",
    hint: "Footer quick links column",
  },
  {
    key: "footerPortalLinks",
    title: "Footer Portal Links",
    hint: "Footer portal links column",
  },
  {
    key: "footerFeaturedProducts",
    title: "Footer Featured Products",
    hint: "Footer featured products column",
  },
];

export default function NavigationPage() {
  const [form, setForm] = useState<NavForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSiteSettings().then((s) => {
      if (s) {
        setForm({
          aboutLinks: s.aboutLinks || [],
          primaryLinks: s.primaryLinks || [],
          footerQuickLinks: s.footerQuickLinks || [],
          footerPortalLinks: s.footerPortalLinks || [],
          footerFeaturedProducts: s.footerFeaturedProducts || [],
        });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await saveSiteSettings(form as Partial<SiteSettings>);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function updateLink(
    key: keyof NavForm,
    index: number,
    field: keyof NavLink,
    value: string
  ) {
    const list = [...form[key]];
    list[index] = { ...list[index], [field]: value };
    setForm({ ...form, [key]: list });
  }

  function addLink(key: keyof NavForm) {
    setForm({ ...form, [key]: [...form[key], { label: "", href: "" }] });
  }

  function removeLink(key: keyof NavForm, index: number) {
    setForm({
      ...form,
      [key]: form[key].filter((_, i) => i !== index),
    });
  }

  if (loading) {
    return <div className="admin-card text-sm text-gray-500">Loading…</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Menus & Links</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit navigation and footer link arrays
          </p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Navigation"}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          Navigation saved.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {SECTIONS.map(({ key, title, hint }) => (
        <div key={key} className="admin-card space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                {title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
            </div>
            <button
              className="btn-secondary text-xs py-1.5"
              onClick={() => addLink(key)}
            >
              <MdAdd size={14} className="inline" /> Add
            </button>
          </div>
          {form[key].length === 0 ? (
            <p className="text-sm text-gray-400">No links yet.</p>
          ) : (
            form[key].map((link, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end"
              >
                <div>
                  <label className="admin-label">Label</label>
                  <input
                    className="admin-input"
                    value={link.label}
                    onChange={(e) =>
                      updateLink(key, i, "label", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="admin-label">Href</label>
                  <input
                    className="admin-input"
                    value={link.href}
                    onChange={(e) =>
                      updateLink(key, i, "href", e.target.value)
                    }
                  />
                </div>
                <button
                  className="btn-danger py-2 px-2"
                  onClick={() => removeLink(key, i)}
                >
                  <MdDelete size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
