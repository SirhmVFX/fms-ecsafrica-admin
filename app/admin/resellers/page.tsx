"use client";

import { useEffect, useState } from "react";
import {
  getResellersPage,
  saveResellersPage,
  ResellersPageContent,
} from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdDelete } from "react-icons/md";

type Form = Omit<ResellersPageContent, "id" | "updatedAt">;

const empty: Form = {
  badge: "",
  heroHeadline: "",
  heroBody: "",
  heroCtaLabel: "",
  programImage: "",
  whyEyebrow: "",
  whyHeadline: "",
  whyBody: "",
  howEyebrow: "",
  howHeadline: "",
  benefits: [],
  steps: [],
  regions: [],
  testimonials: [],
};

export default function ResellersPage() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [regionsText, setRegionsText] = useState("");

  useEffect(() => {
    getResellersPage().then((data) => {
      if (data) {
        const { id: _id, updatedAt: _u, ...rest } = data;
        setForm({ ...empty, ...rest });
        setRegionsText((rest.regions || []).join("\n"));
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await saveResellersPage({
        ...form,
        regions: regionsText
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
            Resellers / Partners
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit the Resellers page content
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
          <label className="admin-label">Badge</label>
          <input
            className="admin-input"
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Headline</label>
          <input
            className="admin-input"
            value={form.heroHeadline}
            onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Body</label>
          <textarea
            className="admin-input"
            rows={3}
            value={form.heroBody}
            onChange={(e) => setForm({ ...form, heroBody: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">CTA Label</label>
          <input
            className="admin-input"
            value={form.heroCtaLabel}
            onChange={(e) =>
              setForm({ ...form, heroCtaLabel: e.target.value })
            }
          />
        </div>
        <ImageUpload
          value={form.programImage}
          onChange={(url) => setForm((f) => ({ ...f, programImage: url }))}
          label="How it works image"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Why Eyebrow</label>
            <input
              className="admin-input"
              value={form.whyEyebrow}
              onChange={(e) => setForm({ ...form, whyEyebrow: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">How Eyebrow</label>
            <input
              className="admin-input"
              value={form.howEyebrow}
              onChange={(e) => setForm({ ...form, howEyebrow: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="admin-label">Why Headline</label>
          <input
            className="admin-input"
            value={form.whyHeadline}
            onChange={(e) => setForm({ ...form, whyHeadline: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Why Body</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.whyBody}
            onChange={(e) => setForm({ ...form, whyBody: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">How Headline</label>
          <input
            className="admin-input"
            value={form.howHeadline}
            onChange={(e) => setForm({ ...form, howHeadline: e.target.value })}
          />
        </div>
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Benefits
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                benefits: [
                  ...form.benefits,
                  {
                    id: `benefit-${Date.now()}`,
                    title: "",
                    summary: "",
                    detail: "",
                  },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.benefits.map((b, i) => (
          <div key={b.id || i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Benefit {i + 1}</span>
              <button
                className="btn-danger py-1 px-2"
                onClick={() =>
                  setForm({
                    ...form,
                    benefits: form.benefits.filter((_, j) => j !== i),
                  })
                }
              >
                <MdDelete size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="admin-label">ID</label>
                <input
                  className="admin-input"
                  value={b.id}
                  onChange={(e) => {
                    const benefits = [...form.benefits];
                    benefits[i] = { ...benefits[i], id: e.target.value };
                    setForm({ ...form, benefits });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Title</label>
                <input
                  className="admin-input"
                  value={b.title}
                  onChange={(e) => {
                    const benefits = [...form.benefits];
                    benefits[i] = { ...benefits[i], title: e.target.value };
                    setForm({ ...form, benefits });
                  }}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Summary</label>
              <input
                className="admin-input"
                value={b.summary}
                onChange={(e) => {
                  const benefits = [...form.benefits];
                  benefits[i] = { ...benefits[i], summary: e.target.value };
                  setForm({ ...form, benefits });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Detail</label>
              <textarea
                className="admin-input"
                rows={2}
                value={b.detail}
                onChange={(e) => {
                  const benefits = [...form.benefits];
                  benefits[i] = { ...benefits[i], detail: e.target.value };
                  setForm({ ...form, benefits });
                }}
              />
            </div>
          </div>
        ))}
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
                  { step: "", title: "", body: "" },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.steps.map((s, i) => (
          <div key={i} className="grid grid-cols-[80px_1fr_2fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Step</label>
              <input
                className="admin-input"
                value={s.step}
                onChange={(e) => {
                  const steps = [...form.steps];
                  steps[i] = { ...steps[i], step: e.target.value };
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
            <div>
              <label className="admin-label">Body</label>
              <input
                className="admin-input"
                value={s.body}
                onChange={(e) => {
                  const steps = [...form.steps];
                  steps[i] = { ...steps[i], body: e.target.value };
                  setForm({ ...form, steps });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  steps: form.steps.filter((_, j) => j !== i),
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
          Regions
        </p>
        <div>
          <label className="admin-label">One region per line</label>
          <textarea
            className="admin-input"
            rows={5}
            value={regionsText}
            onChange={(e) => setRegionsText(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Testimonials
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                testimonials: [
                  ...form.testimonials,
                  { quote: "", author: "", company: "" },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.testimonials.map((t, i) => (
          <div key={i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Testimonial {i + 1}</span>
              <button
                className="btn-danger py-1 px-2"
                onClick={() =>
                  setForm({
                    ...form,
                    testimonials: form.testimonials.filter((_, j) => j !== i),
                  })
                }
              >
                <MdDelete size={12} />
              </button>
            </div>
            <div>
              <label className="admin-label">Quote</label>
              <textarea
                className="admin-input"
                rows={2}
                value={t.quote}
                onChange={(e) => {
                  const testimonials = [...form.testimonials];
                  testimonials[i] = {
                    ...testimonials[i],
                    quote: e.target.value,
                  };
                  setForm({ ...form, testimonials });
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="admin-label">Author</label>
                <input
                  className="admin-input"
                  value={t.author}
                  onChange={(e) => {
                    const testimonials = [...form.testimonials];
                    testimonials[i] = {
                      ...testimonials[i],
                      author: e.target.value,
                    };
                    setForm({ ...form, testimonials });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Company</label>
                <input
                  className="admin-input"
                  value={t.company}
                  onChange={(e) => {
                    const testimonials = [...form.testimonials];
                    testimonials[i] = {
                      ...testimonials[i],
                      company: e.target.value,
                    };
                    setForm({ ...form, testimonials });
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
