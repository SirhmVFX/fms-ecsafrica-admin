"use client";

import { useEffect, useState } from "react";
import {
  getBenefitsPage,
  saveBenefitsPage,
  BenefitsPageContent,
} from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdDelete } from "react-icons/md";

type Form = Omit<BenefitsPageContent, "id" | "updatedAt">;

const empty: Form = {
  heroHeadline: "",
  intro: "",
  heroImage: "",
  stepsImage: "",
  stepsHeadline: "",
  steps: [],
  industries: [],
  pillars: [],
  stats: [],
  ctaHeadline: "",
  ctaBody: "",
  ctaImage: "",
};

export default function BenefitsPage() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBenefitsPage().then((data) => {
      if (data) {
        const { id: _id, updatedAt: _u, ...rest } = data;
        setForm({ ...empty, ...rest });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await saveBenefitsPage(form);
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
          <h1 className="text-lg font-semibold text-gray-900">Benefits</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit the Benefits page content
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
        <ImageUpload
          value={form.heroImage}
          onChange={(url) => setForm((f) => ({ ...f, heroImage: url }))}
          label="Hero Image"
        />
        <ImageUpload
          value={form.stepsImage}
          onChange={(url) => setForm((f) => ({ ...f, stepsImage: url }))}
          label="Image beside steps"
        />
        <div>
          <label className="admin-label">Steps Headline</label>
          <input
            className="admin-input"
            value={form.stepsHeadline}
            onChange={(e) =>
              setForm({ ...form, stepsHeadline: e.target.value })
            }
            placeholder="Our step-by-step approach."
          />
        </div>
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Steps</p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                steps: [
                  ...form.steps,
                  { number: "", title: "", summary: "", details: "" },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.steps.map((s, i) => (
          <div key={i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Step {i + 1}</span>
              <button
                className="btn-danger py-1 px-2"
                onClick={() =>
                  setForm({
                    ...form,
                    steps: form.steps.filter((_, j) => j !== i),
                  })
                }
              >
                <MdDelete size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="admin-label">Number</label>
                <input
                  className="admin-input"
                  value={s.number}
                  onChange={(e) => {
                    const steps = [...form.steps];
                    steps[i] = { ...steps[i], number: e.target.value };
                    setForm({ ...form, steps });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Title</label>
                <input
                  className="admin-input"
                  value={s.title}
                  onChange={(e) => {
                    const steps = [...form.steps];
                    steps[i] = { ...steps[i], title: e.target.value };
                    setForm({ ...form, steps });
                  }}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Summary</label>
              <input
                className="admin-input"
                value={s.summary}
                onChange={(e) => {
                  const steps = [...form.steps];
                  steps[i] = { ...steps[i], summary: e.target.value };
                  setForm({ ...form, steps });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Details</label>
              <textarea
                className="admin-input"
                rows={2}
                value={s.details}
                onChange={(e) => {
                  const steps = [...form.steps];
                  steps[i] = { ...steps[i], details: e.target.value };
                  setForm({ ...form, steps });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Industries
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                industries: [...form.industries, { title: "", body: "" }],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.industries.map((item, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={item.title}
                onChange={(e) => {
                  const industries = [...form.industries];
                  industries[i] = { ...industries[i], title: e.target.value };
                  setForm({ ...form, industries });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Body</label>
              <input
                className="admin-input"
                value={item.body}
                onChange={(e) => {
                  const industries = [...form.industries];
                  industries[i] = { ...industries[i], body: e.target.value };
                  setForm({ ...form, industries });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  industries: form.industries.filter((_, j) => j !== i),
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
          <p className="text-xs font-semibold uppercase text-gray-500">
            Pillars
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                pillars: [...form.pillars, { title: "", body: "" }],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.pillars.map((item, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={item.title}
                onChange={(e) => {
                  const pillars = [...form.pillars];
                  pillars[i] = { ...pillars[i], title: e.target.value };
                  setForm({ ...form, pillars });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Body</label>
              <input
                className="admin-input"
                value={item.body}
                onChange={(e) => {
                  const pillars = [...form.pillars];
                  pillars[i] = { ...pillars[i], body: e.target.value };
                  setForm({ ...form, pillars });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  pillars: form.pillars.filter((_, j) => j !== i),
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
        <ImageUpload
          value={form.ctaImage}
          onChange={(url) => setForm((f) => ({ ...f, ctaImage: url }))}
          label="CTA Image"
        />
      </div>
    </div>
  );
}
