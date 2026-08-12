"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  Service,
} from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";

type FormState = Omit<Service, "id" | "blocks"> & { blocksJson: string };

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
  blocksJson: "[]",
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
  const [showModal, setShowModal] = useState(false);
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
    setShowModal(true);
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
      blocksJson: JSON.stringify(service.blocks ?? [], null, 2),
    });
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title) {
      setError("Title is required.");
      return;
    }
    let blocks: Service["blocks"] = [];
    try {
      const parsed = JSON.parse(form.blocksJson || "[]");
      if (!Array.isArray(parsed)) {
        setError("Blocks must be a JSON array.");
        return;
      }
      blocks = parsed;
    } catch {
      setError("Invalid JSON in blocks field.");
      return;
    }

    const { blocksJson: _, ...rest } = form;
    const payload: Omit<Service, "id"> = {
      ...rest,
      slug: form.slug || slugify(form.title),
      blocks,
    };

    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await updateService(editing.id, payload);
      } else {
        await createService(payload);
      }
      setShowModal(false);
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
            Manage service pages and content blocks
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
                      <Image
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 760 }}>
            <div className="modal-header">
              <h2 className="text-base font-semibold">
                {editing ? "Edit Service" : "New Service"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                  {error}
                </p>
              )}

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Slug</label>
                  <input
                    className="admin-input"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Nav Label</label>
                  <input
                    className="admin-input"
                    value={form.navLabel}
                    onChange={(e) =>
                      setForm({ ...form, navLabel: e.target.value })
                    }
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
                <label className="admin-label">Meta Description</label>
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
                onChange={(url) => setForm({ ...form, heroImage: url })}
                label="Hero Image"
              />

              <div>
                <label className="admin-label">Hero Image Alt</label>
                <input
                  className="admin-input"
                  value={form.heroImageAlt}
                  onChange={(e) =>
                    setForm({ ...form, heroImageAlt: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="admin-label">Callout</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={form.callout}
                  onChange={(e) => setForm({ ...form, callout: e.target.value })}
                />
              </div>

              <div>
                <label className="admin-label">Blocks (JSON array)</label>
                <textarea
                  className="admin-input font-mono text-xs"
                  rows={10}
                  value={form.blocksJson}
                  onChange={(e) =>
                    setForm({ ...form, blocksJson: e.target.value })
                  }
                  placeholder='[{"type":"text","body":"..."}]'
                />
                <p className="text-xs text-gray-400 mt-1">
                  Must be valid JSON. Default: []
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <label className="flex items-center gap-2 text-sm cursor-pointer mt-6">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                  />
                  Published
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  className="btn-primary flex-1"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Service"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
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
