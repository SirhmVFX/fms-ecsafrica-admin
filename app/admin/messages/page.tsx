"use client";

import { useEffect, useState } from "react";
import {
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
  getResellerApplications,
  markResellerRead,
  deleteResellerApplication,
  ContactMessage,
  ResellerApplication,
} from "@/lib/firestore";
import { MdDelete, MdMarkEmailRead, MdClose } from "react-icons/md";
import { Timestamp } from "firebase/firestore";

type Tab = "messages" | "applications";

function formatDate(ts?: Timestamp) {
  if (!ts) return "–";
  const d = ts.toDate ? ts.toDate() : new Date(ts as unknown as number);
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessagesPage() {
  const [tab, setTab] = useState<Tab>("messages");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<ResellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [selectedApp, setSelectedApp] = useState<ResellerApplication | null>(
    null
  );

  async function load() {
    setLoading(true);
    const [msgs, apps] = await Promise.all([
      getContactMessages(),
      getResellerApplications(),
    ]);
    setMessages([...msgs].reverse());
    setApplications([...apps].reverse());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const unreadMsgs = messages.filter((m) => !m.read).length;
  const unreadApps = applications.filter((a) => !a.read).length;

  async function handleMarkMsg(id: string) {
    await markMessageRead(id);
    await load();
  }

  async function handleDeleteMsg(id: string) {
    if (!confirm("Delete this message?")) return;
    await deleteContactMessage(id);
    setSelectedMsg(null);
    await load();
  }

  async function handleMarkApp(id: string) {
    await markResellerRead(id);
    await load();
  }

  async function handleDeleteApp(id: string) {
    if (!confirm("Delete this application?")) return;
    await deleteResellerApplication(id);
    setSelectedApp(null);
    await load();
  }

  return (
    <div className="w-full space-y-4">
      <div className="section-header">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Contact form messages and reseller applications
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className={`px-4 py-2 text-sm border ${
            tab === "messages"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-600"
          }`}
          onClick={() => setTab("messages")}
        >
          Contact Messages
          {unreadMsgs > 0 && (
            <span className="badge badge-red ml-2">{unreadMsgs}</span>
          )}
        </button>
        <button
          className={`px-4 py-2 text-sm border ${
            tab === "applications"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-600"
          }`}
          onClick={() => setTab("applications")}
        >
          Reseller Applications
          {unreadApps > 0 && (
            <span className="badge badge-red ml-2">{unreadApps}</span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="admin-card text-sm text-gray-500">Loading…</div>
      ) : tab === "messages" ? (
        messages.length === 0 ? (
          <div className="admin-card text-sm text-gray-500 text-center py-8">
            No messages yet.
          </div>
        ) : (
          <div className="admin-card p-0 overflow-hidden overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id} className={!m.read ? "bg-blue-50" : ""}>
                    <td className="font-medium text-gray-800 whitespace-nowrap">
                      {m.name}
                    </td>
                    <td className="text-gray-600 text-xs">{m.email}</td>
                    <td className="text-gray-500 text-xs">
                      {m.subject || "—"}
                    </td>
                    <td>
                      <button
                        className="text-blue-700 text-xs hover:underline text-left max-w-45 truncate block"
                        onClick={() => setSelectedMsg(m)}
                      >
                        {m.message}
                      </button>
                    </td>
                    <td className="text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(m.createdAt)}
                    </td>
                    <td>
                      <span
                        className={`badge ${m.read ? "badge-gray" : "badge-blue"}`}
                      >
                        {m.read ? "Read" : "New"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {!m.read && (
                          <button
                            className="btn-secondary py-1 px-2"
                            title="Mark as read"
                            onClick={() => handleMarkMsg(m.id!)}
                          >
                            <MdMarkEmailRead size={14} />
                          </button>
                        )}
                        <button
                          className="btn-danger py-1 px-2"
                          onClick={() => handleDeleteMsg(m.id!)}
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
        )
      ) : applications.length === 0 ? (
        <div className="admin-card text-sm text-gray-500 text-center py-8">
          No applications yet.
        </div>
      ) : (
        <div className="admin-card p-0 overflow-hidden overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Country</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className={!a.read ? "bg-blue-50" : ""}>
                  <td className="font-medium text-gray-800 whitespace-nowrap">
                    {a.name}
                  </td>
                  <td className="text-gray-600 text-xs">{a.email}</td>
                  <td className="text-gray-500 text-xs">{a.company || "—"}</td>
                  <td className="text-gray-500 text-xs">{a.country}</td>
                  <td className="text-gray-500 text-xs whitespace-nowrap">
                    {formatDate(a.createdAt)}
                  </td>
                  <td>
                    <span
                      className={`badge ${a.read ? "badge-gray" : "badge-blue"}`}
                    >
                      {a.read ? "Read" : "New"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn-secondary py-1 px-2 text-xs"
                        onClick={() => setSelectedApp(a)}
                      >
                        View
                      </button>
                      {!a.read && (
                        <button
                          className="btn-secondary py-1 px-2"
                          title="Mark as read"
                          onClick={() => handleMarkApp(a.id!)}
                        >
                          <MdMarkEmailRead size={14} />
                        </button>
                      )}
                      <button
                        className="btn-danger py-1 px-2"
                        onClick={() => handleDeleteApp(a.id!)}
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

      {selectedMsg && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="text-base font-semibold">
                Message from {selectedMsg.name}
              </h2>
              <button onClick={() => setSelectedMsg(null)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="admin-label">Email</span>
                  <p>{selectedMsg.email}</p>
                </div>
                <div>
                  <span className="admin-label">Phone</span>
                  <p>{selectedMsg.phone || "–"}</p>
                </div>
                <div>
                  <span className="admin-label">Subject</span>
                  <p>{selectedMsg.subject || "–"}</p>
                </div>
                <div>
                  <span className="admin-label">Date</span>
                  <p>{formatDate(selectedMsg.createdAt)}</p>
                </div>
              </div>
              <div>
                <span className="admin-label">Message</span>
                <p className="text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 p-4 bg-gray-50">
                  {selectedMsg.message}
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedMsg.email}`}
                  className="btn-primary text-sm"
                >
                  Reply by Email
                </a>
                {!selectedMsg.read && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      handleMarkMsg(selectedMsg.id!);
                      setSelectedMsg(null);
                    }}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  className="btn-danger ml-auto"
                  onClick={() => handleDeleteMsg(selectedMsg.id!)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="text-base font-semibold">
                Application from {selectedApp.name}
              </h2>
              <button onClick={() => setSelectedApp(null)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="admin-label">Email</span>
                  <p>{selectedApp.email}</p>
                </div>
                <div>
                  <span className="admin-label">Phone</span>
                  <p>{selectedApp.phone || "–"}</p>
                </div>
                <div>
                  <span className="admin-label">Company</span>
                  <p>{selectedApp.company || "–"}</p>
                </div>
                <div>
                  <span className="admin-label">Country</span>
                  <p>{selectedApp.country}</p>
                </div>
                <div>
                  <span className="admin-label">Date</span>
                  <p>{formatDate(selectedApp.createdAt)}</p>
                </div>
              </div>
              {selectedApp.message && (
                <div>
                  <span className="admin-label">Message</span>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 p-4 bg-gray-50">
                    {selectedApp.message}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedApp.email}`}
                  className="btn-primary text-sm"
                >
                  Reply by Email
                </a>
                {!selectedApp.read && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      handleMarkApp(selectedApp.id!);
                      setSelectedApp(null);
                    }}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  className="btn-danger ml-auto"
                  onClick={() => handleDeleteApp(selectedApp.id!)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
