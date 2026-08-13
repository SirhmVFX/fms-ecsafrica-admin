"use client";

import { useEffect, useState } from "react";
import AdminImage from "@/components/AdminImage";
import {
  getCsrPage,
  saveCsrPage,
  getCsrInitiatives,
  createCsrInitiative,
  updateCsrInitiative,
  deleteCsrInitiative,
  CsrPageContent,
  CsrInitiative,
} from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";

type PageForm = Omit<CsrPageContent, "id" | "updatedAt">;

const emptyPage: PageForm = {
  heroHeadline: "",
  intro: "",
  heroImage: "",
  pillars: [],
  ctaHeadline: "",
  ctaBody: "",
  ctaImage: "",
};

const emptyInitiative: Omit<CsrInitiative, "id"> = {
  title: "",
  partner: "",
  description: "",
  image: "",
  category: "",
  featured: false,
  order: 0,
  active: true,
};

export default function CsrPage() {
  const [form, setForm] = useState<PageForm>(emptyPage);
  const [initiatives, setInitiatives] = useState<CsrInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CsrInitiative | null>(null);
  const [initForm, setInitForm] =
    useState<Omit<CsrInitiative, "id">>(emptyInitiative);
  const [initSaving, setInitSaving] = useState(false);
  const [initError, setInitError] = useState("");

  async function load() {
    setLoading(true);
    const [page, list] = await Promise.all([getCsrPage(), getCsrInitiatives()]);
    if (page) {
      const { id: _id, updatedAt: _u, ...rest } = page;
      setForm({ ...emptyPage, ...rest });
    }
    setInitiatives(list);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSavePage() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await saveCsrPage(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function openNew() {
    setEditing(null);
    setInitForm({ ...emptyInitiative, order: initiatives.length });
    setInitError("");
    setShowModal(true);
  }

  function openEdit(item: CsrInitiative) {
    setEditing(item);
    setInitForm({
      title: item.title,
      partner: item.partner,
      description: item.description,
      image: item.image,
      category: item.category,
      featured: item.featured,
      order: item.order,
      active: item.active,
    });
    setInitError("");
    setShowModal(true);
  }

  async function handleSaveInit() {
    if (!initForm.title) {
      setInitError("Title is required.");
      return;
    }
    setInitSaving(true);
    setInitError("");
    try {
      if (editing?.id) {
        await updateCsrInitiative(editing.id, initForm);
      } else {
        await createCsrInitiative(initForm);
      }
      setShowModal(false);
      setInitiatives(await getCsrInitiatives());
    } catch (e) {
      setInitError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setInitSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this initiative?")) return;
    await deleteCsrInitiative(id);
    setInitiatives(await getCsrInitiatives());
  }

  if (loading) {
    return <div className="admin-card text-sm text-gray-500">Loading…</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">CSR</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Corporate social responsibility page and initiatives
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={handleSavePage}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Page"}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3">
          Page saved.
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
        <div>
          <label className="admin-label">CTA Headline</label>
          <input
            className="admin-input"
            value={form.ctaHeadline}
            onChange={(e) => setForm({ ...form, ctaHeadline: e.target.value })}
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
                pillars: [
                  ...form.pillars,
                  { label: "", title: "", body: "" },
                ],
              })
            }
          >
            <MdAdd size={14} className="inline" /> Add
          </button>
        </div>
        {form.pillars.map((p, i) => (
          <div key={i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Pillar {i + 1}</span>
              <button
                className="btn-danger py-1 px-2"
                onClick={() =>
                  setForm({
                    ...form,
                    pillars: form.pillars.filter((_, j) => j !== i),
                  })
                }
              >
                <MdDelete size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="admin-label">Label</label>
                <input
                  className="admin-input"
                  value={p.label}
                  onChange={(e) => {
                    const pillars = [...form.pillars];
                    pillars[i] = { ...pillars[i], label: e.target.value };
                    setForm({ ...form, pillars });
                  }}
                />
              </div>
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
            </div>
            <div>
              <label className="admin-label">Body</label>
              <textarea
                className="admin-input"
                rows={2}
                value={p.body}
                onChange={(e) => {
                  const pillars = [...form.pillars];
                  pillars[i] = { ...pillars[i], body: e.target.value };
                  setForm({ ...form, pillars });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Initiatives
          </p>
          <button
            className="btn-primary flex items-center gap-1 text-xs py-1.5"
            onClick={openNew}
          >
            <MdAdd size={14} /> Add Initiative
          </button>
        </div>
        {initiatives.length === 0 ? (
          <p className="text-sm text-gray-500">No initiatives yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Partner</th>
                  <th>Category</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {initiatives.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image && (
                        <AdminImage
                          src={item.image}
                          alt=""
                          width={64}
                          height={40}
                          className="w-16 h-10 object-cover"
                        />
                      )}
                    </td>
                    <td className="font-medium text-gray-800">{item.title}</td>
                    <td className="text-gray-500 text-xs">{item.partner}</td>
                    <td className="text-gray-500 text-xs">{item.category}</td>
                    <td className="text-xs">{item.order}</td>
                    <td>
                      <span
                        className={`badge ${item.active ? "badge-green" : "badge-gray"}`}
                      >
                        {item.active ? "Active" : "Hidden"}
                      </span>
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
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="text-base font-semibold">
                {editing ? "Edit Initiative" : "New Initiative"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {initError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                  {initError}
                </p>
              )}
              <div>
                <label className="admin-label">Title</label>
                <input
                  className="admin-input"
                  value={initForm.title}
                  onChange={(e) =>
                    setInitForm({ ...initForm, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Partner</label>
                  <input
                    className="admin-input"
                    value={initForm.partner}
                    onChange={(e) =>
                      setInitForm({ ...initForm, partner: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="admin-label">Category</label>
                  <input
                    className="admin-input"
                    value={initForm.category}
                    onChange={(e) =>
                      setInitForm({ ...initForm, category: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Description</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={initForm.description}
                  onChange={(e) =>
                    setInitForm({ ...initForm, description: e.target.value })
                  }
                />
              </div>
              <ImageUpload
                value={initForm.image}
                onChange={(url) => setInitForm((f) => ({ ...f, image: url }))}
                label="Image"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={initForm.order}
                    onChange={(e) =>
                      setInitForm({
                        ...initForm,
                        order: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 mt-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={initForm.active}
                      onChange={(e) =>
                        setInitForm({ ...initForm, active: e.target.checked })
                      }
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={initForm.featured}
                      onChange={(e) =>
                        setInitForm({
                          ...initForm,
                          featured: e.target.checked,
                        })
                      }
                    />
                    Featured
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  className="btn-primary flex-1"
                  onClick={handleSaveInit}
                  disabled={initSaving}
                >
                  {initSaving ? "Saving…" : "Save"}
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
