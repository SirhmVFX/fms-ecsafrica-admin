"use client";

import { useEffect, useState } from "react";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  AdminUser,
} from "@/lib/firestore";
import { useAuth } from "@/lib/auth";
import { MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";

const empty: Omit<AdminUser, "id"> = {
  email: "",
  name: "",
  role: "editor",
  uid: "",
};

const roleOptions: AdminUser["role"][] = ["super_admin", "admin", "editor"];

export default function TeamPage() {
  const { createAdmin, adminUser: currentAdmin } = useAuth();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<Omit<AdminUser, "id">>(empty);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isSuperAdmin = currentAdmin?.role === "super_admin";

  async function load() {
    setLoading(true);
    setItems(await getAdminUsers());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(empty);
    setPassword("");
    setError("");
    setShowModal(true);
  }

  function openEdit(u: AdminUser) {
    setEditing(u);
    setForm({
      email: u.email,
      name: u.name,
      role: u.role,
      uid: u.uid,
    });
    setPassword("");
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.email || !form.name) {
      setError("Email and name are required.");
      return;
    }
    if (!editing && !password) {
      setError("Password is required for new admins.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await updateAdminUser(editing.id, {
          name: form.name,
          role: form.role,
        });
      } else {
        const newUser = await createAdmin(form.email, password);
        await createAdminUser({
          name: form.name,
          email: form.email,
          role: form.role,
          uid: newUser.uid,
        });
      }
      setShowModal(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(u: AdminUser) {
    if (!u.id) return;
    if (!isSuperAdmin) {
      alert("Only Super Admins can delete team members.");
      return;
    }
    if (!confirm(`Remove ${u.name} from the admin team?`)) return;
    await deleteAdminUser(u.id);
    await load();
  }

  function roleBadge(role: AdminUser["role"]) {
    if (role === "super_admin") return "badge-red";
    if (role === "admin") return "badge-blue";
    return "badge-gray";
  }

  return (
    <div className="w-full space-y-4">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Admin Team</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage admin users and their roles
          </p>
        </div>
        {isSuperAdmin && (
          <button
            className="btn-primary flex items-center gap-2"
            onClick={openNew}
          >
            <MdAdd size={16} /> Add Admin
          </button>
        )}
      </div>

      <div className="admin-card p-4">
        <p className="text-xs font-semibold uppercase text-gray-500 mb-3">
          Role Permissions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="border border-red-100 p-3">
            <p className="font-semibold text-red-700 mb-1">Super Admin</p>
            <p className="text-xs text-gray-600">
              Full access — manage team, content, and settings.
            </p>
          </div>
          <div className="border border-blue-100 p-3">
            <p className="font-semibold text-blue-700 mb-1">Admin</p>
            <p className="text-xs text-gray-600">
              Manage all content and messages. Cannot manage team members.
            </p>
          </div>
          <div className="border border-gray-100 p-3">
            <p className="font-semibold text-gray-700 mb-1">Editor</p>
            <p className="text-xs text-gray-600">
              Create and edit content. Limited settings access.
            </p>
          </div>
        </div>
      </div>

      {!isSuperAdmin && (
        <div className="admin-card p-4 bg-yellow-50 border-yellow-200">
          <p className="text-xs text-yellow-800">
            You need Super Admin access to add or remove team members.
          </p>
        </div>
      )}

      {loading ? (
        <div className="admin-card text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="admin-card text-sm text-gray-500 text-center py-8">
          No admin users yet.
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium text-gray-800">{u.name}</td>
                  <td className="text-gray-500 text-xs">{u.email}</td>
                  <td>
                    <span className={`badge ${roleBadge(u.role)}`}>
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn-secondary py-1 px-2"
                        onClick={() => openEdit(u)}
                        disabled={!isSuperAdmin}
                      >
                        <MdEdit size={14} />
                      </button>
                      <button
                        className="btn-danger py-1 px-2"
                        onClick={() => handleDelete(u)}
                        disabled={!isSuperAdmin}
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
                {editing ? "Edit Admin User" : "Add Admin User"}
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
                <label className="admin-label">Full Name</label>
                <input
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="admin-label">Email</label>
                <input
                  type="email"
                  className="admin-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!!editing}
                  placeholder="admin@example.com"
                />
              </div>

              {!editing && (
                <div>
                  <label className="admin-label">Password</label>
                  <input
                    type="password"
                    className="admin-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                </div>
              )}

              <div>
                <label className="admin-label">Role</label>
                <select
                  className="admin-input"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as AdminUser["role"],
                    })
                  }
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {r.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  className="btn-primary flex-1"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : editing ? "Update" : "Create Admin"}
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
