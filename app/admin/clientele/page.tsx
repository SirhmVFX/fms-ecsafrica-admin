"use client";

import { useEffect, useState } from "react";
import AdminImage from "@/components/AdminImage";
import {
  getClientele,
  createClientele,
  updateClientele,
  deleteClientele,
  getClientelePage,
  saveClientelePage,
  ClienteleItem,
  ClientelePageContent,
} from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import { MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";

const CATEGORIES = ["banking", "ngo", "government", "corporate"] as const;

const empty: Omit<ClienteleItem, "id"> = {
  name: "",
  src: "",
  category: "corporate",
  order: 0,
  active: true,
};

const emptyPage: Omit<ClientelePageContent, "id" | "updatedAt"> = {
  heroHeadline: "",
  intro: "",
  stats: [],
};

export default function ClientelePage() {
  const [items, setItems] = useState<ClienteleItem[]>([]);
  const [pageForm, setPageForm] = useState(emptyPage);
  const [pageSaving, setPageSaving] = useState(false);
  const [pageSaved, setPageSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ClienteleItem | null>(null);
  const [form, setForm] = useState<Omit<ClienteleItem, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const [list, page] = await Promise.all([getClientele(), getClientelePage()]);
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

  function openEdit(item: ClienteleItem) {
    setEditing(item);
    setForm({
      name: item.name,
      src: item.src,
      category: item.category,
      order: item.order,
      active: item.active,
    });
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name) {
      setError("Name is required.");
      return;
    }
    if (!form.src) {
      setError("Logo image is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await updateClientele(editing.id, form);
      } else {
        await createClientele(form);
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
    if (!confirm("Delete this client?")) return;
    await deleteClientele(id);
    await load();
  }

  async function toggleActive(item: ClienteleItem) {
    if (!item.id) return;
    await updateClientele(item.id, { active: !item.active });
    await load();
  }

  return (
    <div className="w-full space-y-4">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Clientele</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage client logos and categories
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openNew}>
          <MdAdd size={16} /> New Client
        </button>
      </div>

      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Listing page
          </p>
          <button
            className="btn-primary"
            disabled={pageSaving}
            onClick={async () => {
              setPageSaving(true);
              setPageSaved(false);
              try {
                await saveClientelePage(pageForm);
                setPageSaved(true);
                setTimeout(() => setPageSaved(false), 3000);
              } finally {
                setPageSaving(false);
              }
            }}
          >
            {pageSaving ? "Saving…" : "Save listing"}
          </button>
        </div>
        {pageSaved && (
          <p className="text-sm text-green-700">Listing saved.</p>
        )}
        <div>
          <label className="admin-label">Headline</label>
          <input
            className="admin-input"
            value={pageForm.heroHeadline}
            onChange={(e) =>
              setPageForm({ ...pageForm, heroHeadline: e.target.value })
            }
            placeholder="Trusted by organisations across Africa"
          />
        </div>
        <div>
          <label className="admin-label">Intro</label>
          <textarea
            className="admin-input"
            rows={3}
            value={pageForm.intro}
            onChange={(e) =>
              setPageForm({ ...pageForm, intro: e.target.value })
            }
          />
        </div>
      </div>

      {loading ? (
        <div className="admin-card text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="admin-card text-sm text-gray-500 text-center py-8">
          No clients yet.
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
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
                        className="w-16 h-10 object-contain"
                      />
                    )}
                  </td>
                  <td className="font-medium text-gray-800">{item.name}</td>
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
                {editing ? "Edit Client" : "New Client"}
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
                <label className="admin-label">Name</label>
                <input
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <ImageUpload
                value={form.src}
                onChange={(url) => setForm((f) => ({ ...f, src: url }))}
                label="Logo"
              />

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
