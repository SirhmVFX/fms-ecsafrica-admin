"use client";

import { useEffect, useState } from "react";
import { getAboutPage, saveAboutPage, AboutPageContent } from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdDelete } from "react-icons/md";

type Form = Omit<AboutPageContent, "id" | "updatedAt">;

const empty: Form = {
  heroHeadline: "",
  intro: "",
  heroImage: "",
  stats: [],
  vision: "",
  mission: "",
  purpose: "",
  coreValues: [],
  trustedBy: [],
  faqs: [],
  featuredQuote: "",
  featuredQuoteAuthor: "",
  featuredEyebrow: "",
  featuredHeadline: "",
  pillarsImage: "",
  pillarsEyebrow: "",
  pillarsHeadline: "",
  pillarsCtaLabel: "",
  pillarsCtaHref: "",
  valuesEyebrow: "",
  valuesHeadline: "",
  trustedEyebrow: "",
  faqEyebrow: "",
  faqHeadline: "",
  ctaHeadline: "",
  ctaBody: "",
  ctaImage: "",
};

export default function AboutPage() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [trustedText, setTrustedText] = useState("");

  useEffect(() => {
    getAboutPage().then((data) => {
      if (data) {
        const { id: _id, updatedAt: _u, ...rest } = data;
        setForm({ ...empty, ...rest });
        setTrustedText((rest.trustedBy || []).join("\n"));
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await saveAboutPage({
        ...form,
        trustedBy: trustedText
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
          <h1 className="text-lg font-semibold text-gray-900">About Us</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit the About page content
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
      </div>

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Vision / Mission / Purpose
        </p>
        <div>
          <label className="admin-label">Vision</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.vision}
            onChange={(e) => setForm({ ...form, vision: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Mission</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.mission}
            onChange={(e) => setForm({ ...form, mission: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Purpose</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
        </div>
        <ImageUpload
          value={form.pillarsImage}
          onChange={(url) => setForm((f) => ({ ...f, pillarsImage: url }))}
          label="Image beside Vision / Mission / Purpose"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Button label</label>
            <input
              className="admin-input"
              value={form.pillarsCtaLabel}
              onChange={(e) =>
                setForm({ ...form, pillarsCtaLabel: e.target.value })
              }
              placeholder="Learn more"
            />
          </div>
          <div>
            <label className="admin-label">Button URL</label>
            <input
              className="admin-input"
              value={form.pillarsCtaHref}
              onChange={(e) =>
                setForm({ ...form, pillarsCtaHref: e.target.value })
              }
              placeholder="/about-us/contact-us"
            />
          </div>
        </div>
        <div>
          <label className="admin-label">Section Eyebrow</label>
          <input
            className="admin-input"
            value={form.pillarsEyebrow}
            onChange={(e) =>
              setForm({ ...form, pillarsEyebrow: e.target.value })
            }
            placeholder="Who we are"
          />
        </div>
        <div>
          <label className="admin-label">Section Headline</label>
          <input
            className="admin-input"
            value={form.pillarsHeadline}
            onChange={(e) =>
              setForm({ ...form, pillarsHeadline: e.target.value })
            }
            placeholder="Our vision, mission and purpose"
          />
        </div>
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
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Core Values
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                coreValues: [...form.coreValues, { title: "", body: "" }],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Section Eyebrow</label>
            <input
              className="admin-input"
              value={form.valuesEyebrow}
              onChange={(e) =>
                setForm({ ...form, valuesEyebrow: e.target.value })
              }
              placeholder="What guides us"
            />
          </div>
          <div>
            <label className="admin-label">Section Headline</label>
            <input
              className="admin-input"
              value={form.valuesHeadline}
              onChange={(e) =>
                setForm({ ...form, valuesHeadline: e.target.value })
              }
              placeholder="Core values"
            />
          </div>
        </div>
        {form.coreValues.map((v, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={v.title}
                onChange={(e) => {
                  const coreValues = [...form.coreValues];
                  coreValues[i] = { ...coreValues[i], title: e.target.value };
                  setForm({ ...form, coreValues });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Body</label>
              <input
                className="admin-input"
                value={v.body}
                onChange={(e) => {
                  const coreValues = [...form.coreValues];
                  coreValues[i] = { ...coreValues[i], body: e.target.value };
                  setForm({ ...form, coreValues });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  coreValues: form.coreValues.filter((_, j) => j !== i),
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
          Trusted By
        </p>
        <div>
          <label className="admin-label">Section Eyebrow</label>
          <input
            className="admin-input"
            value={form.trustedEyebrow}
            onChange={(e) =>
              setForm({ ...form, trustedEyebrow: e.target.value })
            }
            placeholder="Trusted by"
          />
        </div>
        <div>
          <label className="admin-label">Names (one per line)</label>
          <textarea
            className="admin-input"
            rows={5}
            value={trustedText}
            onChange={(e) => setTrustedText(e.target.value)}
            placeholder="Client name&#10;Another client"
          />
        </div>
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">FAQs</p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                faqs: [...form.faqs, { question: "", answer: "" }],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Section Eyebrow</label>
            <input
              className="admin-input"
              value={form.faqEyebrow}
              onChange={(e) =>
                setForm({ ...form, faqEyebrow: e.target.value })
              }
              placeholder="FAQ"
            />
          </div>
          <div>
            <label className="admin-label">Section Headline</label>
            <input
              className="admin-input"
              value={form.faqHeadline}
              onChange={(e) =>
                setForm({ ...form, faqHeadline: e.target.value })
              }
              placeholder="Your questions, answered"
            />
          </div>
        </div>
        {form.faqs.map((f, i) => (
          <div key={i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex justify-between items-center">
              <label className="admin-label mb-0">FAQ {i + 1}</label>
              <button
                className="btn-danger py-1 px-2"
                onClick={() =>
                  setForm({
                    ...form,
                    faqs: form.faqs.filter((_, j) => j !== i),
                  })
                }
              >
                <MdDelete size={12} />
              </button>
            </div>
            <input
              className="admin-input"
              placeholder="Question"
              value={f.question}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[i] = { ...faqs[i], question: e.target.value };
                setForm({ ...form, faqs });
              }}
            />
            <textarea
              className="admin-input"
              rows={2}
              placeholder="Answer"
              value={f.answer}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[i] = { ...faqs[i], answer: e.target.value };
                setForm({ ...form, faqs });
              }}
            />
          </div>
        ))}
      </div>

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Featured Quote & CTA
        </p>
        <div>
          <label className="admin-label">Featured Eyebrow</label>
          <input
            className="admin-input"
            value={form.featuredEyebrow}
            onChange={(e) =>
              setForm({ ...form, featuredEyebrow: e.target.value })
            }
            placeholder="What we stand for"
          />
        </div>
        <div>
          <label className="admin-label">Featured Headline</label>
          <input
            className="admin-input"
            value={form.featuredHeadline}
            onChange={(e) =>
              setForm({ ...form, featuredHeadline: e.target.value })
            }
          />
        </div>
        <div>
          <label className="admin-label">Featured Quote</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.featuredQuote}
            onChange={(e) =>
              setForm({ ...form, featuredQuote: e.target.value })
            }
          />
        </div>
        <div>
          <label className="admin-label">Quote Author</label>
          <input
            className="admin-input"
            value={form.featuredQuoteAuthor}
            onChange={(e) =>
              setForm({ ...form, featuredQuoteAuthor: e.target.value })
            }
          />
        </div>
        <ImageUpload
          value={form.ctaImage}
          onChange={(url) => setForm((f) => ({ ...f, ctaImage: url }))}
          label="Consultation CTA Image (optional override)"
        />
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
