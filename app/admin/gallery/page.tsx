"use client";

import { useEffect, useState } from "react";
import AdminImage from "@/components/AdminImage";
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getGalleryPage,
  saveGalleryPage,
  GalleryItem,
  GalleryPageContent,
} from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";

const CATEGORIES = ["technical", "malaysia", "partnerships"] as const;

const empty: Omit<GalleryItem, "id"> = {
  src: "",
  title: "",
  category: "technical",
  order: 0,
  active: true,
};

const emptyPage: Omit<GalleryPageContent, "id" | "updatedAt"> = {
  heroHeadline: "",
  intro: "",
  heroImage: "",
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [pageForm, setPageForm] = useState(emptyPage);
  const [pageSaving, setPageSaving] = useState(false);
  const [pageSaved, setPageSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<Omit<GalleryItem, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const [list, page] = await Promise.all([
      getGalleryItems(),
      getGalleryPage(),
    ]);
    setItems(list);
    if (page) {
      const { id: _id, updatedAt: _u, ...rest } = page;
      setPageForm({ ...emptyPage, ...rest });
    }
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

  function openEdit(item: GalleryItem) {
    setEditing(item);
    setForm({
      src: item.src,
      title: item.title,
      category: item.category,
      order: item.order,
      active: item.active,
    });
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title) {
      setError("Title is required.");
      return;
    }
    if (!form.src) {
      setError("Image is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await updateGalleryItem(editing.id, form);
      } else {
        await createGalleryItem(form);
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
    if (!confirm("Delete this gallery item?")) return;
    await deleteGalleryItem(id);
    await load();
  }

  async function toggleActive(item: GalleryItem) {
    if (!item.id) return;
    await updateGalleryItem(item.id, { active: !item.active });
    await load();
  }

  return (
    <div className="w-full space-y-4">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Gallery</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage gallery images and categories
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openNew}>
          <MdAdd size={16} /> New Item
        </button>
      </div>

      {pageSaved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          Gallery page saved.
        </div>
      )}

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Gallery Hero
          </p>
          <button
            className="btn-primary"
            disabled={pageSaving}
            onClick={async () => {
              setPageSaving(true);
              try {
                await saveGalleryPage(pageForm);
                setPageSaved(true);
                setTimeout(() => setPageSaved(false), 3000);
              } finally {
                setPageSaving(false);
              }
            }}
          >
            {pageSaving ? "Saving…" : "Save Hero"}
          </button>
        </div>
        <div>
          <label className="admin-label">Headline</label>
          <input
            className="admin-input"
            value={pageForm.heroHeadline}
            onChange={(e) =>
              setPageForm({ ...pageForm, heroHeadline: e.target.value })
            }
            placeholder="Our work in action."
          />
        </div>
        <div>
          <label className="admin-label">Intro</label>
          <textarea
            className="admin-input"
            rows={2}
            value={pageForm.intro}
            onChange={(e) =>
              setPageForm({ ...pageForm, intro: e.target.value })
            }
          />
        </div>
        <ImageUpload
          value={pageForm.heroImage}
          onChange={(url) => setPageForm((f) => ({ ...f, heroImage: url }))}
          label="Hero Image"
        />
      </div>

      {loading ? (
        <div className="admin-card text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="admin-card text-sm text-gray-500 text-center py-8">
          No gallery items yet.
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.src && (
                      <AdminImage
                        src={item.src}
                        alt=""
                        width={64}
                        height={40}
                        className="w-16 h-10 object-cover"
                      />
                    )}
                  </td>
                  <td className="font-medium text-gray-800">{item.title}</td>
                  <td className="text-gray-500 text-xs capitalize">
                    {item.category}
                  </td>
                  <td className="text-gray-500 text-xs">{item.order}</td>
                  <td>
                    <button onClick={() => toggleActive(item)}>
                      <span
                        className={`badge ${item.active ? "badge-green" : "badge-gray"}`}
                      >
                        {item.active ? "Active" : "Hidden"}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn-secondary py-1 px-2 text-xs"
                        onClick={() => openEdit(item)}
                      >
                        <MdEdit size={14} />
                      </button>
                      <button
                        className="btn-danger py-1 px-2 text-xs"
                        onClick={() => handleDelete(item.id!)}
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
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="text-base font-semibold">
                {editing ? "Edit Gallery Item" : "New Gallery Item"}
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

              <ImageUpload
                value={form.src}
                onChange={(url) => setForm((f) => ({ ...f, src: url }))}
                label="Image"
              />

              <div>
                <label className="admin-label">Title</label>
                <input
                  className="admin-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Category</label>
                  <select
                    className="admin-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
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
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                />
                Active
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  className="btn-primary flex-1"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
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
