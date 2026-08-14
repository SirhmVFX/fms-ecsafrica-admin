"use client";

import { useCallback, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  saveSiteSettings,
  saveHomepage,
  saveAboutPage,
  saveAccreditationPage,
  saveCsrPage,
  saveBenefitsPage,
  saveResellersPage,
  saveContactPage,
  savePrivacyPage,
  saveGalleryPage,
  saveBlogPage,
  saveClientelePage,
  createHeroSlide,
  createCsrInitiative,
  createService,
  createBlogPost,
  createGalleryItem,
  createClientele,
} from "@/lib/firestore";
import {
  seedSections,
  seedSiteSettings,
  seedHeroSlides,
  seedHomepage,
  seedAboutPage,
  seedAccreditationPage,
  seedCsrPage,
  seedCsrInitiatives,
  seedBenefitsPage,
  seedResellersPage,
  seedContactPage,
  seedPrivacyPage,
  seedGalleryPage,
  seedBlogPage,
  seedClientelePage,
  seedServices,
  seedBlogPosts,
  seedGalleryItems,
  seedClientele,
  emptySiteSettings,
  type SeedSectionId,
} from "@/lib/seed-data";

type LogEntry = {
  section: string;
  status: "ok" | "skip" | "error";
  message: string;
};

async function collectionHasDocs(col: string): Promise<boolean> {
  const snap = await getDocs(collection(db, col));
  return !snap.empty;
}

async function clearCollection(col: string): Promise<number> {
  const snap = await getDocs(collection(db, col));
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, col, d.id))));
  return snap.size;
}

async function seedSection(
  id: SeedSectionId,
  overwrite: boolean,
): Promise<LogEntry> {
  const meta = seedSections.find((s) => s.id === id)!;
  const exists = await collectionHasDocs(meta.collection);

  if (exists && !overwrite) {
    return {
      section: meta.label,
      status: "skip",
      message: "Already has data — skipped (confirm overwrite to replace)",
    };
  }

  if (exists && overwrite) {
    await clearCollection(meta.collection);
  }

  switch (id) {
    case "siteSettings":
      await saveSiteSettings(seedSiteSettings);
      break;
    case "homepage":
      await saveHomepage(seedHomepage);
      break;
    case "aboutPage":
      await saveAboutPage(seedAboutPage);
      break;
    case "accreditationPage":
      await saveAccreditationPage(seedAccreditationPage);
      break;
    case "csrPage":
      await saveCsrPage(seedCsrPage);
      break;
    case "benefitsPage":
      await saveBenefitsPage(seedBenefitsPage);
      break;
    case "resellersPage":
      await saveResellersPage(seedResellersPage);
      break;
    case "contactPage":
      await saveContactPage(seedContactPage);
      break;
    case "privacyPage":
      await savePrivacyPage(seedPrivacyPage);
      break;
    case "galleryPage":
      await saveGalleryPage(seedGalleryPage);
      break;
    case "blogPage":
      await saveBlogPage(seedBlogPage);
      break;
    case "clientelePage":
      await saveClientelePage(seedClientelePage);
      break;
    case "heroSlides":
      for (const slide of seedHeroSlides) {
        await createHeroSlide(slide);
      }
      break;
    case "csrInitiatives":
      for (const item of seedCsrInitiatives) {
        await createCsrInitiative(item);
      }
      break;
    case "services":
      for (const service of seedServices) {
        await createService(service);
      }
      break;
    case "blogPosts":
      for (const post of seedBlogPosts) {
        await createBlogPost(post);
      }
      break;
    case "galleryItems":
      for (const item of seedGalleryItems) {
        await createGalleryItem(item);
      }
      break;
    case "clientele":
      for (const item of seedClientele) {
        await createClientele(item);
      }
      break;
  }

  return {
    section: meta.label,
    status: "ok",
    message: `Seeded ${meta.count} ${meta.kind === "singleton" ? "document" : "items"}`,
  };
}

export default function SeedPage() {
  const [busy, setBusy] = useState(false);
  const [activeId, setActiveId] = useState<SeedSectionId | "all" | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const confirmOverwrite = useCallback(async (label: string) => {
    return window.confirm(
      `${label} already has documents in Firestore.\n\nOverwrite (delete existing then re-seed)?`,
    );
  }, []);

  const runOne = useCallback(
    async (id: SeedSectionId) => {
      const meta = seedSections.find((s) => s.id === id)!;
      const exists = await collectionHasDocs(meta.collection);
      let overwrite = false;
      if (exists) {
        overwrite = await confirmOverwrite(meta.label);
        if (!overwrite) {
          return {
            section: meta.label,
            status: "skip" as const,
            message: "Skipped — overwrite declined",
          };
        }
      }
      return seedSection(id, overwrite);
    },
    [confirmOverwrite],
  );

  const handleSeedOne = async (id: SeedSectionId) => {
    setBusy(true);
    setActiveId(id);
    try {
      const result = await runOne(id);
      setLogs((prev) => [result, ...prev]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setLogs((prev) => [{ section: id, status: "error", message }, ...prev]);
    } finally {
      setBusy(false);
      setActiveId(null);
    }
  };

  const handleSeedAll = async () => {
    setBusy(true);
    setActiveId("all");
    const results: LogEntry[] = [];
    try {
      for (const section of seedSections) {
        setActiveId(section.id);
        const result = await runOne(section.id);
        results.push(result);
      }
      setLogs((prev) => [...results.reverse(), ...prev]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setLogs((prev) => [
        { section: "Seed All", status: "error", message },
        ...prev,
      ]);
    } finally {
      setBusy(false);
      setActiveId(null);
    }
  };

  const handleEmptySettings = async () => {
    if (
      !window.confirm(
        "Write an empty SiteSettings document? Existing settings will be overwritten.",
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await saveSiteSettings(emptySiteSettings);
      setLogs((prev) => [
        {
          section: "Site Settings",
          status: "ok",
          message: "Wrote empty SiteSettings defaults",
        },
        ...prev,
      ]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setLogs((prev) => [
        { section: "Site Settings", status: "error", message },
        ...prev,
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Import Seed Data
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Copy hardcoded public-site content into Firestore. Existing
          collections prompt for overwrite confirmation before replace.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={handleSeedAll}
          className="bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {activeId === "all" || busy ? "Seeding…" : "Seed All"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={handleEmptySettings}
          className="border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 disabled:opacity-50"
        >
          Create empty SiteSettings
        </button>
      </div>

      <div className="overflow-hidden border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Section</th>
              <th className="px-4 py-3 font-semibold">Items</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {seedSections.map((section) => (
              <tr
                key={section.id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {section.label}
                </td>
                <td className="px-4 py-3 text-gray-500">{section.count}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleSeedOne(section.id)}
                    className="text-sm font-semibold text-primary hover:underline disabled:opacity-50"
                  >
                    {activeId === section.id ? "Seeding…" : "Seed"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length > 0 && (
        <div className="border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">Activity</h2>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto text-sm">
            {logs.map((log, index) => (
              <li
                key={`${log.section}-${index}`}
                className={
                  log.status === "ok"
                    ? "text-emerald-700"
                    : log.status === "skip"
                      ? "text-amber-700"
                      : "text-red-700"
                }
              >
                <span className="font-semibold">{log.section}:</span>{" "}
                {log.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
