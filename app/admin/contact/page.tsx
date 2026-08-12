"use client";

import { useEffect, useState } from "react";
import {
  getContactPage,
  saveContactPage,
  ContactPageContent,
} from "@/lib/firestore";
import { MdAdd, MdDelete } from "react-icons/md";

type Form = Omit<ContactPageContent, "id" | "updatedAt">;

const empty: Form = {
  heroHeadline: "",
  intro: "",
  hqLocation: "",
  hqPhone: "",
  hqEmail: "",
  inquiryCards: [],
  offices: [],
  faqs: [],
};

export default function ContactPage() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getContactPage().then((data) => {
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
      await saveContactPage(form);
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
          <h1 className="text-lg font-semibold text-gray-900">Contact</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit the Contact page content
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
          Hero & HQ
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
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="admin-label">HQ Location</label>
            <input
              className="admin-input"
              value={form.hqLocation}
              onChange={(e) =>
                setForm({ ...form, hqLocation: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">HQ Phone</label>
            <input
              className="admin-input"
              value={form.hqPhone}
              onChange={(e) => setForm({ ...form, hqPhone: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">HQ Email</label>
            <input
              className="admin-input"
              value={form.hqEmail}
              onChange={(e) => setForm({ ...form, hqEmail: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Inquiry Cards
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                inquiryCards: [
                  ...form.inquiryCards,
                  {
                    id: `card-${Date.now()}`,
                    title: "",
                    description: "",
                    email: "",
                    href: "",
                    icon: "",
                  },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.inquiryCards.map((c, i) => (
          <div key={c.id || i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Card {i + 1}</span>
              <button
                className="btn-danger py-1 px-2"
                onClick={() =>
                  setForm({
                    ...form,
                    inquiryCards: form.inquiryCards.filter((_, j) => j !== i),
                  })
                }
              >
                <MdDelete size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="admin-label">ID</label>
                <input
                  className="admin-input"
                  value={c.id}
                  onChange={(e) => {
                    const inquiryCards = [...form.inquiryCards];
                    inquiryCards[i] = {
                      ...inquiryCards[i],
                      id: e.target.value,
                    };
                    setForm({ ...form, inquiryCards });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Title</label>
                <input
                  className="admin-input"
                  value={c.title}
                  onChange={(e) => {
                    const inquiryCards = [...form.inquiryCards];
                    inquiryCards[i] = {
                      ...inquiryCards[i],
                      title: e.target.value,
                    };
                    setForm({ ...form, inquiryCards });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input
                  className="admin-input"
                  value={c.email}
                  onChange={(e) => {
                    const inquiryCards = [...form.inquiryCards];
                    inquiryCards[i] = {
                      ...inquiryCards[i],
                      email: e.target.value,
                    };
                    setForm({ ...form, inquiryCards });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Href</label>
                <input
                  className="admin-input"
                  value={c.href || ""}
                  onChange={(e) => {
                    const inquiryCards = [...form.inquiryCards];
                    inquiryCards[i] = {
                      ...inquiryCards[i],
                      href: e.target.value,
                    };
                    setForm({ ...form, inquiryCards });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Icon</label>
                <input
                  className="admin-input"
                  value={c.icon}
                  onChange={(e) => {
                    const inquiryCards = [...form.inquiryCards];
                    inquiryCards[i] = {
                      ...inquiryCards[i],
                      icon: e.target.value,
                    };
                    setForm({ ...form, inquiryCards });
                  }}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-input"
                rows={2}
                value={c.description}
                onChange={(e) => {
                  const inquiryCards = [...form.inquiryCards];
                  inquiryCards[i] = {
                    ...inquiryCards[i],
                    description: e.target.value,
                  };
                  setForm({ ...form, inquiryCards });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Offices
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                offices: [
                  ...form.offices,
                  { country: "", phone: "", email: "" },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.offices.map((o, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Country</label>
              <input
                className="admin-input"
                value={o.country}
                onChange={(e) => {
                  const offices = [...form.offices];
                  offices[i] = { ...offices[i], country: e.target.value };
                  setForm({ ...form, offices });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Phone</label>
              <input
                className="admin-input"
                value={o.phone}
                onChange={(e) => {
                  const offices = [...form.offices];
                  offices[i] = { ...offices[i], phone: e.target.value };
                  setForm({ ...form, offices });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Email</label>
              <input
                className="admin-input"
                value={o.email}
                onChange={(e) => {
                  const offices = [...form.offices];
                  offices[i] = { ...offices[i], email: e.target.value };
                  setForm({ ...form, offices });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  offices: form.offices.filter((_, j) => j !== i),
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
        {form.faqs.map((f, i) => (
          <div key={i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">FAQ {i + 1}</span>
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
    </div>
  );
}
