"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, saveSiteSettings, SiteSettings } from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdDelete } from "react-icons/md";

type Form = Omit<
  SiteSettings,
  | "id"
  | "updatedAt"
  | "aboutLinks"
  | "primaryLinks"
  | "footerQuickLinks"
  | "footerPortalLinks"
  | "footerFeaturedProducts"
>;

const empty: Form = {
  siteName: "",
  siteDescription: "",
  logoUrl: "",
  headerTagline: "",
  headerPhone: "",
  loginLabel: "",
  loginUrl: "",
  footerBlurb: "",
  footerPhone: "",
  footerWhatsapp: "",
  contactPageUrl: "",
  designCreditLabel: "",
  designCreditUrl: "",
  footerCopyright: "",
  facebookUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",
  instagramUrl: "",
  regionalPhones: [],
};

export default function SettingsPage() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSiteSettings().then((s) => {
      if (s) {
        setForm({
          siteName: s.siteName || "",
          siteDescription: s.siteDescription || "",
          logoUrl: s.logoUrl || "",
          headerTagline: s.headerTagline || "",
          headerPhone: s.headerPhone || "",
          loginLabel: s.loginLabel || "",
          loginUrl: s.loginUrl || "",
          footerBlurb: s.footerBlurb || "",
          footerPhone: s.footerPhone || "",
          footerWhatsapp: s.footerWhatsapp || "",
          contactPageUrl: s.contactPageUrl || "",
          designCreditLabel: s.designCreditLabel || "",
          designCreditUrl: s.designCreditUrl || "",
          footerCopyright: s.footerCopyright || "",
          facebookUrl: s.facebookUrl || "",
          twitterUrl: s.twitterUrl || "",
          linkedinUrl: s.linkedinUrl || "",
          youtubeUrl: s.youtubeUrl || "",
          instagramUrl: s.instagramUrl || "",
          regionalPhones: s.regionalPhones || [],
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
      await saveSiteSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function set(key: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return <div className="admin-card text-sm text-gray-500">Loading…</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Site Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            General site settings. Nav links are edited under Menus & Links.
          </p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          Settings saved.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          General
        </p>
        <div>
          <label className="admin-label">Site Name</label>
          <input
            className="admin-input"
            value={form.siteName}
            onChange={(e) => set("siteName", e.target.value)}
          />
        </div>
        <div>
          <label className="admin-label">Site Description</label>
          <textarea
            className="admin-input"
            rows={3}
            value={form.siteDescription}
            onChange={(e) => set("siteDescription", e.target.value)}
          />
        </div>
        <ImageUpload
          value={form.logoUrl}
          onChange={(url) => set("logoUrl", url)}
          label="Logo"
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Header Tagline</label>
            <input
              className="admin-input"
              value={form.headerTagline}
              onChange={(e) => set("headerTagline", e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Header Phone</label>
            <input
              className="admin-input"
              value={form.headerPhone}
              onChange={(e) => set("headerPhone", e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Login Label</label>
            <input
              className="admin-input"
              value={form.loginLabel}
              onChange={(e) => set("loginLabel", e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Login URL</label>
            <input
              className="admin-input"
              value={form.loginUrl}
              onChange={(e) => set("loginUrl", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Footer & Contact
        </p>
        <div>
          <label className="admin-label">Footer Blurb</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.footerBlurb}
            onChange={(e) => set("footerBlurb", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Footer Phone</label>
            <input
              className="admin-input"
              value={form.footerPhone}
              onChange={(e) => set("footerPhone", e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Footer WhatsApp</label>
            <input
              className="admin-input"
              value={form.footerWhatsapp}
              onChange={(e) => set("footerWhatsapp", e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Contact Page URL</label>
            <input
              className="admin-input"
              value={form.contactPageUrl}
              onChange={(e) => set("contactPageUrl", e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Footer Copyright</label>
            <input
              className="admin-input"
              value={form.footerCopyright}
              onChange={(e) => set("footerCopyright", e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Design Credit Label</label>
            <input
              className="admin-input"
              value={form.designCreditLabel}
              onChange={(e) => set("designCreditLabel", e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label">Design Credit URL</label>
            <input
              className="admin-input"
              value={form.designCreditUrl}
              onChange={(e) => set("designCreditUrl", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Social URLs
        </p>
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              ["facebookUrl", "Facebook"],
              ["twitterUrl", "Twitter / X"],
              ["linkedinUrl", "LinkedIn"],
              ["youtubeUrl", "YouTube"],
              ["instagramUrl", "Instagram"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="admin-label">{label}</label>
              <input
                className="admin-input"
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Regional Phones
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                regionalPhones: [
                  ...form.regionalPhones,
                  { region: "", phone: "" },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.regionalPhones.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Region</label>
              <input
                className="admin-input"
                value={r.region}
                onChange={(e) => {
                  const regionalPhones = [...form.regionalPhones];
                  regionalPhones[i] = {
                    ...regionalPhones[i],
                    region: e.target.value,
                  };
                  setForm({ ...form, regionalPhones });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Phone</label>
              <input
                className="admin-input"
                value={r.phone}
                onChange={(e) => {
                  const regionalPhones = [...form.regionalPhones];
                  regionalPhones[i] = {
                    ...regionalPhones[i],
                    phone: e.target.value,
                  };
                  setForm({ ...form, regionalPhones });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  regionalPhones: form.regionalPhones.filter((_, j) => j !== i),
                })
              }
            >
              <MdDelete size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
