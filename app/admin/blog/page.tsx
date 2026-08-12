"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  BlogPost,
} from "@/lib/firestore";
import ImageUpload from "@/components/ImageUpload";
import WysiwygEditor from "@/components/WysiwygEditor";
import { MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";

const empty: Omit<BlogPost, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  date: new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  readTime: "5 min read",
  category: "",
  author: "",
  image: "",
  featured: false,
  published: false,
  order: 0,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Omit<BlogPost, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setItems(await getBlogPosts());
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

  function openEdit(post: BlogPost) {
    setEditing(post);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      readTime: post.readTime,
      category: post.category,
      author: post.author,
      image: post.image,
      featured: post.featured,
      published: post.published,
      order: post.order,
    });
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title) {
      setError("Title is required.");
      return;
    }
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
    };
    setSaving(true);
    setError("");
    try {
      if (editing?.id) {
        await updateBlogPost(editing.id, payload);
      } else {
        await createBlogPost(payload);
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
    if (!confirm("Delete this blog post?")) return;
    await deleteBlogPost(id);
    await load();
  }

  async function togglePublished(post: BlogPost) {
    if (!post.id) return;
    await updateBlogPost(post.id, { published: !post.published });
    await load();
  }

  return (
    <div className="w-full space-y-4">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Blog Posts</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage blog articles on the website
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openNew}>
          <MdAdd size={16} /> New Post
        </button>
      </div>

      {loading ? (
        <div className="admin-card text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="admin-card text-sm text-gray-500 text-center py-8">
          No blog posts yet.
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Order</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((post) => (
                <tr key={post.id}>
                  <td>
                    {post.image && (
                      <Image
                        src={post.image}
                        alt=""
                        width={64}
                        height={40}
                        className="w-16 h-10 object-cover"
                      />
                    )}
                  </td>
                  <td className="font-medium text-gray-800 max-w-45 truncate">
                    {post.title}
                  </td>
                  <td className="text-gray-500 text-xs">{post.category || "—"}</td>
                  <td className="text-gray-500 text-xs whitespace-nowrap">
                    {post.date}
                  </td>
                  <td className="text-gray-500 text-xs">{post.order}</td>
                  <td>
                    <span
                      className={`badge ${post.featured ? "badge-blue" : "badge-gray"}`}
                    >
                      {post.featured ? "Featured" : "–"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => togglePublished(post)}>
                      <span
                        className={`badge ${post.published ? "badge-green" : "badge-yellow"}`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn-secondary py-1 px-2 text-xs"
                        onClick={() => openEdit(post)}
                      >
                        <MdEdit size={14} />
                      </button>
                      <button
                        className="btn-danger py-1 px-2 text-xs"
                        onClick={() => handleDelete(post.id!)}
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
                {editing ? "Edit Post" : "New Post"}
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
                  placeholder="Post title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Slug</label>
                  <input
                    className="admin-input"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="url-slug"
                  />
                </div>
                <div>
                  <label className="admin-label">Category</label>
                  <input
                    className="admin-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    placeholder="e.g. Insights"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Excerpt</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="Short summary"
                />
              </div>

              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Cover Image"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Date</label>
                  <input
                    className="admin-input"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Read Time</label>
                  <input
                    className="admin-input"
                    value={form.readTime}
                    onChange={(e) =>
                      setForm({ ...form, readTime: e.target.value })
                    }
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Author</label>
                  <input
                    className="admin-input"
                    value={form.author}
                    onChange={(e) =>
                      setForm({ ...form, author: e.target.value })
                    }
                  />
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

              <div>
                <label className="admin-label">Content</label>
                <WysiwygEditor
                  content={form.content}
                  onChange={(html) => setForm({ ...form, content: html })}
                  placeholder="Write the full post…"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                  />
                  Published
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                  />
                  Featured
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  className="btn-primary flex-1"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Post"}
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
