"use client";

import { useEffect, useRef, useState } from "react";
import AdminImage from "@/components/AdminImage";
import {
  getHomepage,
  saveHomepage,
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  HomepageContent,
  HeroSlide,
} from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";

type HomepageForm = Omit<HomepageContent, "id" | "updatedAt">;

const emptyHomepage: HomepageForm = {
  stats: [],
  missionEyebrow: "",
  missionHeadline: "",
  missionBody: "",
  missionImage: "",
  missionCalloutText: "",
  missionCalloutHref: "",
  solutions: [],
  solutionsPhotoHref: "",
  solutionsPhotoImage: "",
  solutionsPhotoTitle: "",
  solutionsEyebrow: "",
  solutionsHeadline: "",
  solutionsCtaLabel: "",
  solutionsCtaHref: "",
  benefits: [],
  pillars: [],
  stories: [],
  benefitsBandImage: "",
  benefitsBandCtaLabel: "",
  benefitsBandCtaHref: "",
  benefitsEyebrow: "",
  benefitsHeadline: "",
  approachEyebrow: "",
  approachHeadline: "",
  approachCtaLabel: "",
  approachCtaHref: "",
  storiesEyebrow: "",
  storiesHeadline: "",
  ctaImage: "",
  ctaHeadline: "",
  ctaBody: "",
  ctaPrimaryLabel: "",
  ctaPrimaryHref: "",
  ctaSecondaryLabel: "",
  ctaSecondaryHref: "",
};

const emptySlide: Omit<HeroSlide, "id"> = {
  image: "",
  alt: "",
  lineOne: "",
  lineTwo: "",
  body: "",
  order: 0,
  active: true,
};

export default function HomepagePage() {
  const [form, setForm] = useState<HomepageForm>(emptyHomepage);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideForm, setSlideForm] = useState<Omit<HeroSlide, "id">>(emptySlide);
  const [slideSaving, setSlideSaving] = useState(false);
  const [slideError, setSlideError] = useState("");
  const formRef = useRef(form);
  formRef.current = form;

  async function load() {
    setLoading(true);
    const [home, heroSlides] = await Promise.all([getHomepage(), getHeroSlides()]);
    if (home) {
      const { id: _id, updatedAt: _u, ...rest } = home;
      setForm({ ...emptyHomepage, ...rest });
    }
    setSlides(heroSlides);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await saveHomepage(formRef.current);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function openNewSlide() {
    setEditingSlide(null);
    setSlideForm({ ...emptySlide, order: slides.length });
    setSlideError("");
    setShowSlideModal(true);
  }

  function openEditSlide(slide: HeroSlide) {
    setEditingSlide(slide);
    setSlideForm({
      image: slide.image,
      alt: slide.alt,
      lineOne: slide.lineOne,
      lineTwo: slide.lineTwo,
      body: slide.body,
      order: slide.order,
      active: slide.active,
    });
    setSlideError("");
    setShowSlideModal(true);
  }

  async function handleSlideSave() {
    if (!slideForm.lineOne && !slideForm.image) {
      setSlideError("Image or line one is required.");
      return;
    }
    setSlideSaving(true);
    setSlideError("");
    try {
      if (editingSlide?.id) {
        await updateHeroSlide(editingSlide.id, slideForm);
      } else {
        await createHeroSlide(slideForm);
      }
      setShowSlideModal(false);
      setSlides(await getHeroSlides());
    } catch (e) {
      setSlideError(e instanceof Error ? e.message : "Failed to save slide.");
    } finally {
      setSlideSaving(false);
    }
  }

  async function handleSlideDelete(id: string) {
    if (!confirm("Delete this hero slide?")) return;
    await deleteHeroSlide(id);
    setSlides(await getHeroSlides());
  }

  if (loading) {
    return <div className="admin-card text-sm text-gray-500">Loading…</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Homepage</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit homepage content and hero slides
          </p>
        </div>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Homepage"}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          Homepage saved.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Hero slides */}
      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Hero Slides
          </p>
          <button
            className="btn-primary flex items-center gap-1 text-xs py-1.5"
            onClick={openNewSlide}
          >
            <MdAdd size={14} /> Add Slide
          </button>
        </div>
        {slides.length === 0 ? (
          <p className="text-sm text-gray-500">No hero slides yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Line One</th>
                  <th>Line Two</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((s) => (
                  <tr key={s.id}>
                    <td>
                      {s.image && (
                        <AdminImage
                          src={s.image}
                          alt=""
                          width={64}
                          height={40}
                          className="w-16 h-10 object-cover"
                        />
                      )}
                    </td>
                    <td className="font-medium text-gray-800">{s.lineOne}</td>
                    <td className="text-gray-500 text-xs">{s.lineTwo}</td>
                    <td className="text-xs">{s.order}</td>
                    <td>
                      <span
                        className={`badge ${s.active ? "badge-green" : "badge-gray"}`}
                      >
                        {s.active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn-secondary py-1 px-2 text-xs"
                          onClick={() => openEditSlide(s)}
                        >
                          <MdEdit size={14} />
                        </button>
                        <button
                          className="btn-danger py-1 px-2 text-xs"
                          onClick={() => handleSlideDelete(s.id!)}
                        >
                          <MdDelete size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mission */}
      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Mission Section
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Eyebrow</label>
            <input
              className="admin-input"
              value={form.missionEyebrow}
              onChange={(e) =>
                setForm({ ...form, missionEyebrow: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">Headline</label>
            <input
              className="admin-input"
              value={form.missionHeadline}
              onChange={(e) =>
                setForm({ ...form, missionHeadline: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="admin-label">Body</label>
          <textarea
            className="admin-input"
            rows={3}
            value={form.missionBody}
            onChange={(e) => setForm({ ...form, missionBody: e.target.value })}
          />
        </div>
        <ImageUpload
          value={form.missionImage}
          onChange={(url) => setForm((f) => ({ ...f, missionImage: url }))}
          label="Mission Image (right of Who we are)"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Callout Text</label>
            <input
              className="admin-input"
              value={form.missionCalloutText}
              onChange={(e) =>
                setForm({ ...form, missionCalloutText: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">Callout Href</label>
            <input
              className="admin-input"
              value={form.missionCalloutHref}
              onChange={(e) =>
                setForm({ ...form, missionCalloutHref: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <ArrayCard
        title="Stats"
        onAdd={() =>
          setForm({
            ...form,
            stats: [...form.stats, { value: "", label: "" }],
          })
        }
      >
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
      </ArrayCard>

      {/* Solutions */}
      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Solutions
          </p>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() =>
              setForm({
                ...form,
                solutions: [
                  ...form.solutions,
                  {
                    title: "",
                    href: "",
                    description: "",
                    theme: "",
                    iconPath: "",
                  },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Solutions Photo Title</label>
            <input
              className="admin-input"
              value={form.solutionsPhotoTitle}
              onChange={(e) =>
                setForm({ ...form, solutionsPhotoTitle: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">Solutions Photo Href</label>
            <input
              className="admin-input"
              value={form.solutionsPhotoHref}
              onChange={(e) =>
                setForm({ ...form, solutionsPhotoHref: e.target.value })
              }
            />
          </div>
        </div>
        <ImageUpload
          value={form.solutionsPhotoImage}
          onChange={(url) =>
            setForm((f) => ({ ...f, solutionsPhotoImage: url }))
          }
          label="Solutions Photo"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Section Eyebrow</label>
            <input
              className="admin-input"
              value={form.solutionsEyebrow}
              onChange={(e) =>
                setForm({ ...form, solutionsEyebrow: e.target.value })
              }
              placeholder="What we do"
            />
          </div>
          <div>
            <label className="admin-label">All services button</label>
            <input
              className="admin-input"
              value={form.solutionsCtaLabel}
              onChange={(e) =>
                setForm({ ...form, solutionsCtaLabel: e.target.value })
              }
              placeholder="View all services"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Section Headline</label>
            <input
              className="admin-input"
              value={form.solutionsHeadline}
              onChange={(e) =>
                setForm({ ...form, solutionsHeadline: e.target.value })
              }
              placeholder="Our solutions, your connected fleet."
            />
          </div>
          <div>
            <label className="admin-label">All services URL</label>
            <input
              className="admin-input"
              value={form.solutionsCtaHref}
              onChange={(e) =>
                setForm({ ...form, solutionsCtaHref: e.target.value })
              }
              placeholder="/services"
            />
          </div>
        </div>
        {form.solutions.map((sol, i) => (
          <div
            key={i}
            className="border border-gray-100 p-3 space-y-2 relative"
          >
            <button
              className="absolute top-2 right-2 btn-danger py-1 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  solutions: form.solutions.filter((_, j) => j !== i),
                })
              }
            >
              <MdDelete size={12} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="admin-label">Title</label>
                <input
                  className="admin-input"
                  value={sol.title}
                  onChange={(e) => {
                    const solutions = [...form.solutions];
                    solutions[i] = { ...solutions[i], title: e.target.value };
                    setForm({ ...form, solutions });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Href</label>
                <input
                  className="admin-input"
                  value={sol.href}
                  onChange={(e) => {
                    const solutions = [...form.solutions];
                    solutions[i] = { ...solutions[i], href: e.target.value };
                    setForm({ ...form, solutions });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Theme</label>
                <input
                  className="admin-input"
                  value={sol.theme}
                  onChange={(e) => {
                    const solutions = [...form.solutions];
                    solutions[i] = { ...solutions[i], theme: e.target.value };
                    setForm({ ...form, solutions });
                  }}
                />
              </div>
              <div>
                <label className="admin-label">Icon Path</label>
                <input
                  className="admin-input"
                  value={sol.iconPath}
                  onChange={(e) => {
                    const solutions = [...form.solutions];
                    solutions[i] = {
                      ...solutions[i],
                      iconPath: e.target.value,
                    };
                    setForm({ ...form, solutions });
                  }}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-input"
                rows={2}
                value={sol.description}
                onChange={(e) => {
                  const solutions = [...form.solutions];
                  solutions[i] = {
                    ...solutions[i],
                    description: e.target.value,
                  };
                  setForm({ ...form, solutions });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <ArrayCard
        title="Benefits"
        onAdd={() =>
          setForm({
            ...form,
            benefits: [...form.benefits, { title: "", body: "" }],
          })
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Section Eyebrow</label>
            <input
              className="admin-input"
              value={form.benefitsEyebrow}
              onChange={(e) =>
                setForm({ ...form, benefitsEyebrow: e.target.value })
              }
              placeholder="Why it matters"
            />
          </div>
          <div>
            <label className="admin-label">Section Headline</label>
            <input
              className="admin-input"
              value={form.benefitsHeadline}
              onChange={(e) =>
                setForm({ ...form, benefitsHeadline: e.target.value })
              }
              placeholder="Benefits of FMS Africa"
            />
          </div>
        </div>
        {form.benefits.map((b, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end">
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
            <div>
              <label className="admin-label">Body</label>
              <input
                className="admin-input"
                value={b.body}
                onChange={(e) => {
                  const benefits = [...form.benefits];
                  benefits[i] = { ...benefits[i], body: e.target.value };
                  setForm({ ...form, benefits });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  benefits: form.benefits.filter((_, j) => j !== i),
                })
              }
            >
              <MdDelete size={14} />
            </button>
          </div>
        ))}
      </ArrayCard>

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Benefits Band Image
        </p>
        <ImageUpload
          value={form.benefitsBandImage}
          onChange={(url) =>
            setForm((f) => ({ ...f, benefitsBandImage: url }))
          }
          label="Image below benefits accordion"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Band CTA Label</label>
            <input
              className="admin-input"
              value={form.benefitsBandCtaLabel}
              onChange={(e) =>
                setForm({ ...form, benefitsBandCtaLabel: e.target.value })
              }
              placeholder="Partner with us"
            />
          </div>
          <div>
            <label className="admin-label">Band CTA URL</label>
            <input
              className="admin-input"
              value={form.benefitsBandCtaHref}
              onChange={(e) =>
                setForm({ ...form, benefitsBandCtaHref: e.target.value })
              }
              placeholder="/resellers"
            />
          </div>
        </div>
      </div>

      {/* Pillars */}
      <ArrayCard
        title="Pillars"
        onAdd={() =>
          setForm({
            ...form,
            pillars: [...form.pillars, { title: "", body: "" }],
          })
        }
      >
        {form.pillars.map((p, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={p.title}
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
                value={p.body}
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
      </ArrayCard>

      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          Approach & Testimonials Copy
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Approach Eyebrow</label>
            <input
              className="admin-input"
              value={form.approachEyebrow}
              onChange={(e) =>
                setForm({ ...form, approachEyebrow: e.target.value })
              }
              placeholder="Our approach"
            />
          </div>
          <div>
            <label className="admin-label">Approach CTA Label</label>
            <input
              className="admin-input"
              value={form.approachCtaLabel}
              onChange={(e) =>
                setForm({ ...form, approachCtaLabel: e.target.value })
              }
              placeholder="Get a free consultation"
            />
          </div>
        </div>
        <div>
          <label className="admin-label">Approach CTA URL</label>
          <input
            className="admin-input"
            value={form.approachCtaHref}
            onChange={(e) =>
              setForm({ ...form, approachCtaHref: e.target.value })
            }
            placeholder="/about-us/contact-us"
          />
        </div>
        <div>
          <label className="admin-label">Approach Headline</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.approachHeadline}
            onChange={(e) =>
              setForm({ ...form, approachHeadline: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Testimonials Eyebrow</label>
            <input
              className="admin-input"
              value={form.storiesEyebrow}
              onChange={(e) =>
                setForm({ ...form, storiesEyebrow: e.target.value })
              }
              placeholder="Testimonials"
            />
          </div>
          <div>
            <label className="admin-label">Testimonials Headline</label>
            <input
              className="admin-input"
              value={form.storiesHeadline}
              onChange={(e) =>
                setForm({ ...form, storiesHeadline: e.target.value })
              }
              placeholder="What customers say."
            />
          </div>
        </div>
      </div>

      {/* Stories */}
      <ArrayCard
        title="Stories"
        onAdd={() =>
          setForm({
            ...form,
            stories: [...form.stories, { company: "", quote: "" }],
          })
        }
      >
        {form.stories.map((s, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end">
            <div>
              <label className="admin-label">Company</label>
              <input
                className="admin-input"
                value={s.company}
                onChange={(e) => {
                  const stories = [...form.stories];
                  stories[i] = { ...stories[i], company: e.target.value };
                  setForm({ ...form, stories });
                }}
              />
            </div>
            <div>
              <label className="admin-label">Quote</label>
              <input
                className="admin-input"
                value={s.quote}
                onChange={(e) => {
                  const stories = [...form.stories];
                  stories[i] = { ...stories[i], quote: e.target.value };
                  setForm({ ...form, stories });
                }}
              />
            </div>
            <button
              className="btn-danger py-2 px-2"
              onClick={() =>
                setForm({
                  ...form,
                  stories: form.stories.filter((_, j) => j !== i),
                })
              }
            >
              <MdDelete size={14} />
            </button>
          </div>
        ))}
      </ArrayCard>

      {/* CTA */}
      <div className="admin-card space-y-4">
        <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
          CTA Section
        </p>
        <ImageUpload
          value={form.ctaImage}
          onChange={(url) => setForm((f) => ({ ...f, ctaImage: url }))}
          label="Consultation background image"
        />
        <div>
          <label className="admin-label">Headline</label>
          <input
            className="admin-input"
            value={form.ctaHeadline}
            onChange={(e) =>
              setForm({ ...form, ctaHeadline: e.target.value })
            }
          />
        </div>
        <div>
          <label className="admin-label">Body</label>
          <textarea
            className="admin-input"
            rows={2}
            value={form.ctaBody}
            onChange={(e) => setForm({ ...form, ctaBody: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">Primary Label</label>
            <input
              className="admin-input"
              value={form.ctaPrimaryLabel}
              onChange={(e) =>
                setForm({ ...form, ctaPrimaryLabel: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">Primary Href</label>
            <input
              className="admin-input"
              value={form.ctaPrimaryHref}
              onChange={(e) =>
                setForm({ ...form, ctaPrimaryHref: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">Secondary Label</label>
            <input
              className="admin-input"
              value={form.ctaSecondaryLabel}
              onChange={(e) =>
                setForm({ ...form, ctaSecondaryLabel: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">Secondary Href</label>
            <input
              className="admin-input"
              value={form.ctaSecondaryHref}
              onChange={(e) =>
                setForm({ ...form, ctaSecondaryHref: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Homepage"}
        </button>
      </div>

      {showSlideModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="text-base font-semibold">
                {editingSlide ? "Edit Hero Slide" : "New Hero Slide"}
              </h2>
              <button onClick={() => setShowSlideModal(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {slideError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                  {slideError}
                </p>
              )}
              <ImageUpload
                value={slideForm.image}
                onChange={(url) =>
                  setSlideForm((f) => ({ ...f, image: url }))
                }
                label="Slide Image"
              />
              <div>
                <label className="admin-label">Alt Text</label>
                <input
                  className="admin-input"
                  value={slideForm.alt}
                  onChange={(e) =>
                    setSlideForm({ ...slideForm, alt: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="admin-label">Line One</label>
                <input
                  className="admin-input"
                  value={slideForm.lineOne}
                  onChange={(e) =>
                    setSlideForm({ ...slideForm, lineOne: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="admin-label">Line Two</label>
                <input
                  className="admin-input"
                  value={slideForm.lineTwo}
                  onChange={(e) =>
                    setSlideForm({ ...slideForm, lineTwo: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="admin-label">Body</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={slideForm.body}
                  onChange={(e) =>
                    setSlideForm({ ...slideForm, body: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={slideForm.order}
                    onChange={(e) =>
                      setSlideForm({
                        ...slideForm,
                        order: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer mt-6">
                  <input
                    type="checkbox"
                    checked={slideForm.active}
                    onChange={(e) =>
                      setSlideForm({ ...slideForm, active: e.target.checked })
                    }
                  />
                  Active
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  className="btn-primary flex-1"
                  onClick={handleSlideSave}
                  disabled={slideSaving}
                >
                  {slideSaving ? "Saving…" : "Save Slide"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowSlideModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrayCard({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-card space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <p className="text-xs font-semibold uppercase text-gray-500">{title}</p>
        <button className="btn-secondary text-xs py-1.5" onClick={onAdd}>
          <MdAdd size={14} className="inline" /> Add
        </button>
      </div>
      {children}
    </div>
  );
}
