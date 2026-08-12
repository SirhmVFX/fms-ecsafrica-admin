"use client";

import { useEffect, useState } from "react";
import {
  getPrivacyPage,
  savePrivacyPage,
  PrivacyPageContent,
} from "@/lib/firestore";
import { MdAdd, MdDelete } from "react-icons/md";

type SectionForm = {
  title: string;
  paragraphsText: string;
  listText: string;
};

type Form = {
  heroHeadline: string;
  intro: string;
  sections: SectionForm[];
};

const empty: Form = {
  heroHeadline: "",
  intro: "",
  sections: [],
};

function toForm(data: PrivacyPageContent): Form {
  return {
    heroHeadline: data.heroHeadline || "",
    intro: data.intro || "",
    sections: (data.sections || []).map((s) => ({
      title: s.title,
      paragraphsText: (s.paragraphs || []).join("\n\n"),
      listText: (s.list || []).join("\n"),
    })),
  };
}

export default function PrivacyPage() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPrivacyPage().then((data) => {
      if (data) setForm(toForm(data));
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await savePrivacyPage({
        heroHeadline: form.heroHeadline,
        intro: form.intro,
        sections: form.sections.map((s) => {
          const paragraphs = s.paragraphsText
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter(Boolean);
          const list = s.listText
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
          return {
            title: s.title,
            paragraphs,
            ...(list.length > 0 ? { list } : {}),
          };
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="admin-card text-sm text-gray-500">Loading…</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit the Privacy Policy page
          </p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          Saved successfully.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Hero
        </p>
        <div>
          <label className="admin-label">Headline</label>
          <input
            className="admin-input"
            value={form.heroHeadline}
            onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Intro</label>
          <textarea
            className="admin-input"
            rows={3}
            value={form.intro}
            onChange={(e) => setForm({ ...form, intro: e.target.value })}
          />
        </div>
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Sections
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                sections: [
                  ...form.sections,
                  { title: "", paragraphsText: "", listText: "" },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add Section
          </button>
        </div>
        {form.sections.map((s, i) => (
          <div key={i} className="border border-gray-100 p-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Section {i + 1}</span>
              <button
                className="btn-danger py-1 px-2"
                onClick={() =>
                  setForm({
                    ...form,
                    sections: form.sections.filter((_, j) => j !== i),
                  })
                }
              >
                <MdDelete size={12} />
              </button>
            </div>
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={s.title}
                onChange={(e) => {
                  const sections = [...form.sections];
                  sections[i] = { ...sections[i], title: e.target.value };
                  setForm({ ...form, sections });
                }}
              />
            </div>
            <div>
              <label className="admin-label">
                Paragraphs (blank line between paragraphs)
              </label>
              <textarea
                className="admin-input"
                rows={4}
                value={s.paragraphsText}
                onChange={(e) => {
                  const sections = [...form.sections];
                  sections[i] = {
                    ...sections[i],
                    paragraphsText: e.target.value,
                  };
                  setForm({ ...form, sections });
                }}
              />
            </div>
            <div>
              <label className="admin-label">
                List items (optional, one per line)
              </label>
              <textarea
                className="admin-input"
                rows={3}
                value={s.listText}
                onChange={(e) => {
                  const sections = [...form.sections];
                  sections[i] = { ...sections[i], listText: e.target.value };
                  setForm({ ...form, sections });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
