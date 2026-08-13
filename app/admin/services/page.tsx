"use client";

import { useEffect, useState } from "react";
import AdminImage from "@/components/AdminImage";
import ImageUpload from "@/components/ImageUpload";
import ServiceBlocksEditor from "@/components/ServiceBlocksEditor";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  Service,
} from "@/lib/firestore";
import type { ServiceBlock } from "@/lib/service-blocks";
import { MdAdd, MdClose, MdEdit, MdDelete } from "react-icons/md";

type FormState = Omit<Service, "id" | "blocks"> & { blocks: ServiceBlock[] };

const empty: FormState = {
  slug: "",
  title: "",
  tagline: "",
  metaDescription: "",
  heroImage: "",
  heroImageAlt: "",
  callout: "",
  navLabel: "",
  order: 0,
  published: false,
  blocks: [],
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setItems(await getServices());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm({ ...empty, order: items.length });
    setError("");
    setShowEditor(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setForm({
      slug: service.slug,
      title: service.title,
      tagline: service.tagline || "",
      metaDescription: service.metaDescription,
      heroImage: service.heroImage,
      heroImageAlt: service.heroImageAlt,
      callout: service.callout || "",
      navLabel: service.navLabel || "",
      order: service.order,
      published: service.published,
      blocks: Array.isArray(service.blocks) ? service.blocks : [],
    });
    setError("");
    setShowEditor(true);
  }

  async function handleSave() {
    if (!form.title) {
      setError("Title is required.");
      return;
    }

    const payload: Omit<Service, "id"> = {
      ...form,
      slug: form.slug || slugify(form.title),
      blocks: form.blocks,
    };

    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await updateService(editing.id, payload);
      } else {
        await createService(payload);
      }
      setShowEditor(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    await deleteService(id);
    await load();
  }

  async function togglePublished(service: Service) {
    if (!service.id) return;
    await updateService(service.id, { published: !service.published });
    await load();
  }

  return (
    <div className="w-full space-y-4">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Services</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Edit each service page with ordinary text, photos and lists
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openNew}>
          <MdAdd size={16} /> New Service
        </button>
      </div>

      {loading ? (
        <div className="admin-card text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="admin-card text-sm text-gray-500 text-center py-8">
          No services yet.
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Nav Label</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((service) => (
                <tr key={service.id}>
                  <td>
                    {service.heroImage && (
                      <AdminImage
                        src={service.heroImage}
                        alt=""
                        width={64}
                        height={40}
                        className="w-16 h-10 object-cover"
                      />
                    )}
                  </td>
                  <td className="font-medium text-gray-800 max-w-45 truncate">
                    {service.title}
                  </td>
                  <td className="text-gray-500 text-xs">{service.slug}</td>
                  <td className="text-gray-500 text-xs">
                    {service.navLabel || "—"}
                  </td>
                  <td className="text-gray-500 text-xs">{service.order}</td>
                  <td>
                    <button onClick={() => togglePublished(service)}>
                      <span
                        className={`badge ${service.published ? "badge-green" : "badge-yellow"}`}
                      >
                        {service.published ? "Published" : "Draft"}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn-secondary py-1 px-2 text-xs"
                        onClick={() => openEdit(service)}
                      >
                        <MdEdit size={14} />
                      </button>
                      <button
                        className="btn-danger py-1 px-2 text-xs"
                        onClick={() => handleDelete(service.id!)}
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

      {showEditor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-gray-900">
                {editing ? `Edit: ${form.title || "Service"}` : "New Service"}
              </h2>
              <p className="text-xs text-gray-500">
                Fill in the page details, then add the sections visitors will
                see.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-secondary"
                onClick={() => setShowEditor(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save service"}
              </button>
              <button
                className="p-1 lg:hidden"
                onClick={() => setShowEditor(false)}
                aria-label="Close"
              >
                <MdClose size={20} />
              </button>
            </div>
          </div>

          <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
            {error && (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="admin-card space-y-4">
              <p className="text-xs font-semibold uppercase text-gray-500 border-b border-gray-100 pb-3">
                Page details
              </p>
              <div>
                <label className="admin-label">Title</label>
                <input
                  className="admin-input"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      title,
                      slug: editing ? prev.slug : slugify(title),
                    }));
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Page URL</label>
                  <input
                    className="admin-input"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Appears after /services/
                  </p>
                </div>
                <div>
                  <label className="admin-label">Menu name</label>
                  <input
                    className="admin-input"
                    value={form.navLabel}
                    onChange={(e) =>
                      setForm({ ...form, navLabel: e.target.value })
                    }
                    placeholder="Shown in the Services menu"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Tagline</label>
                <input
                  className="admin-input"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
              </div>

              <div>
                <label className="admin-label">Short description</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={form.metaDescription}
                  onChange={(e) =>
                    setForm({ ...form, metaDescription: e.target.value })
                  }
                />
              </div>

              <ImageUpload
                value={form.heroImage}
                onChange={(url) => setForm((f) => ({ ...f, heroImage: url }))}
                label="Hero image"
              />

              <div>
                <label className="admin-label">Hero image description</label>
                <input
                  className="admin-input"
                  value={form.heroImageAlt}
                  onChange={(e) =>
                    setForm({ ...form, heroImageAlt: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="admin-label">Highlight box</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={form.callout}
                  onChange={(e) => setForm({ ...form, callout: e.target.value })}
                  placeholder="Short note shown beside the title"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: Number(e.target.value) || 0 })
                    }
                  />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer sm:mt-6">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                  />
                  Published on the website
                </label>
              </div>
            </div>

            <div className="admin-card">
              <ServiceBlocksEditor
                blocks={form.blocks}
                onChange={(blocks) => setForm((f) => ({ ...f, blocks }))}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 pb-10 sm:flex-row">
              <button
                className="btn-secondary sm:flex-1"
                onClick={() => setShowEditor(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary sm:flex-1"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
