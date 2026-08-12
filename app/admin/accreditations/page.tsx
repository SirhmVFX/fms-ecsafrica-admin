"use client";

import { useEffect, useState } from "react";
import {
  getAccreditationPage,
  saveAccreditationPage,
  AccreditationPageContent,
} from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdDelete } from "react-icons/md";

type Form = Omit<AccreditationPageContent, "id" | "updatedAt">;

const empty: Form = {
  heroHeadline: "",
  intro: "",
  certificateImage: "",
  certificateTitle: "",
  highlights: [],
  commitments: [],
  stats: [],
  ctaHeadline: "",
  ctaBody: "",
};

export default function AccreditationsPage() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [highlightsText, setHighlightsText] = useState("");

  useEffect(() => {
    getAccreditationPage().then((data) => {
      if (data) {
        const { id: _id, updatedAt: _u, ...rest } = data;
        setForm({ ...empty, ...rest });
        setHighlightsText((rest.highlights || []).join("\n"));
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await saveAccreditationPage({
        ...form,
        highlights: highlightsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
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
            Accreditations
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit the Accreditations page content
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
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Certificate
        </p>
        <ImageUpload
          value={form.certificateImage}
          onChange={(url) => setForm({ ...form, certificateImage: url })}
          label="Certificate Image"
        />
        <div>
          <label className="admin-label">Certificate Title</label>
          <input
            className="admin-input"
            value={form.certificateTitle}
            onChange={(e) =>
              setForm({ ...form, certificateTitle: e.target.value })
            }
          />
        </div>
      </div>

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Highlights
        </p>
        <div>
          <label className="admin-label">One per line</label>
          <textarea
            className="admin-input"
            rows={5}
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Commitments
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                commitments: [...form.commitments, { title: "", body: "" }],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.commitments.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={c.title}
                onChange={(e) => {
                  const commitments = [...form.commitments];
                  commitments[i] = {
                    ...commitments[i],
                    title: e.target.value,
                  };
                  setForm({ ...form, commitments });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Body</label>
              <input
                className="admin-input"
                value={c.body}
                onChange={(e) => {
                  const commitments = [...form.commitments];
                  commitments[i] = { ...commitments[i], body: e.target.value };
                  setForm({ ...form, commitments });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  commitments: form.commitments.filter((_, j) => j !== i),
                })
              }
            >
              <MdDelete size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Stats</p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                stats: [...form.stats, { value: "", label: "" }],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.stats.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Value</label>
              <input
                className="admin-input"
                value={s.value}
                onChange={(e) => {
                  const stats = [...form.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  setForm({ ...form, stats });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Label</label>
              <input
                className="admin-input"
                value={s.label}
                onChange={(e) => {
                  const stats = [...form.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  setForm({ ...form, stats });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  stats: form.stats.filter((_, j) => j !== i),
                })
              }
            >
              <MdDelete size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          CTA
        </p>
        <div>
          <label className="admin-label">CTA Headline</label>
          <input
            className="admin-input"
            value={form.ctaHeadline}
            onChange={(e) =>
              setForm({ ...form, ctaHeadline: e.target.value })
            }
          />
        </div>
        <div>
          <label className="admin-label">CTA Body</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.ctaBody}
            onChange={(e) => setForm({ ...form, ctaBody: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
