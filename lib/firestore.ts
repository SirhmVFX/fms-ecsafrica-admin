import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  limit,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  AdminUser,
  SiteSettings,
  HeroSlide,
  HomepageContent,
  AboutPageContent,
  AccreditationPageContent,
  CsrInitiative,
  CsrPageContent,
  BenefitsPageContent,
  ResellersPageContent,
  ContactPageContent,
  PrivacyPageContent,
  Service,
  BlogPost,
  GalleryItem,
  ClienteleItem,
  ContactMessage,
  ResellerApplication,
} from "./types";

export type {
  AdminUser,
  SiteSettings,
  HeroSlide,
  HomepageContent,
  AboutPageContent,
  AccreditationPageContent,
  CsrInitiative,
  CsrPageContent,
  BenefitsPageContent,
  ResellersPageContent,
  ContactPageContent,
  PrivacyPageContent,
  Service,
  BlogPost,
  GalleryItem,
  ClienteleItem,
  ContactMessage,
  ResellerApplication,
};

async function getAll<T>(col: string): Promise<T[]> {
  const snap = await getDocs(collection(db, col));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
}

async function getOrdered<T extends DocumentData>(
  col: string,
  field = "order"
): Promise<T[]> {
  try {
    const q = query(collection(db, col), orderBy(field));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as T));
  } catch {
    const items = await getAll<T & { order?: number }>(col);
    return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)) as T[];
  }
}

async function getOne<T>(col: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, col, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

async function create<T extends DocumentData>(
  col: string,
  data: Omit<T, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, col), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

async function update<T>(
  col: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  await updateDoc(doc(db, col, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

async function remove(col: string, id: string): Promise<void> {
  await deleteDoc(doc(db, col, id));
}

async function getSingleton<T>(col: string): Promise<T | null> {
  const snap = await getDocs(collection(db, col));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as T;
}

async function saveSingleton<T extends DocumentData>(
  col: string,
  data: Partial<T>
): Promise<void> {
  const snap = await getDocs(collection(db, col));
  if (snap.empty) {
    await addDoc(collection(db, col), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(doc(db, col, snap.docs[0].id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }
}

// Site Settings
export const getSiteSettings = () => getSingleton<SiteSettings>("siteSettings");
export const saveSiteSettings = (data: Partial<SiteSettings>) =>
  saveSingleton<SiteSettings>("siteSettings", data);

// Hero slides
export const getHeroSlides = () => getOrdered<HeroSlide>("heroSlides");
export const createHeroSlide = (data: Omit<HeroSlide, "id">) =>
  create<HeroSlide>("heroSlides", data);
export const updateHeroSlide = (id: string, data: Partial<HeroSlide>) =>
  update<HeroSlide>("heroSlides", id, data);
export const deleteHeroSlide = (id: string) => remove("heroSlides", id);

// Homepage
export const getHomepage = () => getSingleton<HomepageContent>("homepage");
export const saveHomepage = (data: Partial<HomepageContent>) =>
  saveSingleton<HomepageContent>("homepage", data);

// About
export const getAboutPage = () => getSingleton<AboutPageContent>("aboutPage");
export const saveAboutPage = (data: Partial<AboutPageContent>) =>
  saveSingleton<AboutPageContent>("aboutPage", data);

// Accreditations
export const getAccreditationPage = () =>
  getSingleton<AccreditationPageContent>("accreditationPage");
export const saveAccreditationPage = (data: Partial<AccreditationPageContent>) =>
  saveSingleton<AccreditationPageContent>("accreditationPage", data);

// CSR
export const getCsrPage = () => getSingleton<CsrPageContent>("csrPage");
export const saveCsrPage = (data: Partial<CsrPageContent>) =>
  saveSingleton<CsrPageContent>("csrPage", data);
export const getCsrInitiatives = () => getOrdered<CsrInitiative>("csrInitiatives");
export const createCsrInitiative = (data: Omit<CsrInitiative, "id">) =>
  create<CsrInitiative>("csrInitiatives", data);
export const updateCsrInitiative = (id: string, data: Partial<CsrInitiative>) =>
  update<CsrInitiative>("csrInitiatives", id, data);
export const deleteCsrInitiative = (id: string) => remove("csrInitiatives", id);

// Benefits
export const getBenefitsPage = () =>
  getSingleton<BenefitsPageContent>("benefitsPage");
export const saveBenefitsPage = (data: Partial<BenefitsPageContent>) =>
  saveSingleton<BenefitsPageContent>("benefitsPage", data);

// Resellers
export const getResellersPage = () =>
  getSingleton<ResellersPageContent>("resellersPage");
export const saveResellersPage = (data: Partial<ResellersPageContent>) =>
  saveSingleton<ResellersPageContent>("resellersPage", data);

// Contact
export const getContactPage = () =>
  getSingleton<ContactPageContent>("contactPage");
export const saveContactPage = (data: Partial<ContactPageContent>) =>
  saveSingleton<ContactPageContent>("contactPage", data);

// Privacy
export const getPrivacyPage = () =>
  getSingleton<PrivacyPageContent>("privacyPage");
export const savePrivacyPage = (data: Partial<PrivacyPageContent>) =>
  saveSingleton<PrivacyPageContent>("privacyPage", data);

// Services
export const getServices = () => getOrdered<Service>("services");
export const getService = (id: string) => getOne<Service>("services", id);
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const q = query(collection(db, "services"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Service;
}
export const createService = (data: Omit<Service, "id">) =>
  create<Service>("services", data);
export const updateService = (id: string, data: Partial<Service>) =>
  update<Service>("services", id, data);
export const deleteService = (id: string) => remove("services", id);

// Blog
export const getBlogPosts = () => getOrdered<BlogPost>("blogPosts");
export const getBlogPost = (id: string) => getOne<BlogPost>("blogPosts", id);
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(collection(db, "blogPosts"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as BlogPost;
}
export const createBlogPost = (data: Omit<BlogPost, "id">) =>
  create<BlogPost>("blogPosts", data);
export const updateBlogPost = (id: string, data: Partial<BlogPost>) =>
  update<BlogPost>("blogPosts", id, data);
export const deleteBlogPost = (id: string) => remove("blogPosts", id);

// Gallery
export const getGalleryItems = () => getOrdered<GalleryItem>("galleryItems");
export const createGalleryItem = (data: Omit<GalleryItem, "id">) =>
  create<GalleryItem>("galleryItems", data);
export const updateGalleryItem = (id: string, data: Partial<GalleryItem>) =>
  update<GalleryItem>("galleryItems", id, data);
export const deleteGalleryItem = (id: string) => remove("galleryItems", id);

// Clientele
export const getClientele = () => getOrdered<ClienteleItem>("clientele");
export const createClientele = (data: Omit<ClienteleItem, "id">) =>
  create<ClienteleItem>("clientele", data);
export const updateClientele = (id: string, data: Partial<ClienteleItem>) =>
  update<ClienteleItem>("clientele", id, data);
export const deleteClientele = (id: string) => remove("clientele", id);

// Messages
export const getContactMessages = () =>
  getOrdered<ContactMessage>("contactMessages", "createdAt");
export const markMessageRead = (id: string) =>
  updateDoc(doc(db, "contactMessages", id), { read: true });
export const deleteContactMessage = (id: string) =>
  remove("contactMessages", id);

export const getResellerApplications = () =>
  getOrdered<ResellerApplication>("resellerApplications", "createdAt");
export const markResellerRead = (id: string) =>
  updateDoc(doc(db, "resellerApplications", id), { read: true });
export const deleteResellerApplication = (id: string) =>
  remove("resellerApplications", id);

// Admin users
export const getAdminUsers = () => getAll<AdminUser>("adminUsers");
export const createAdminUser = (data: Omit<AdminUser, "id">) =>
  create<AdminUser>("adminUsers", data);
export const updateAdminUser = (id: string, data: Partial<AdminUser>) =>
  update<AdminUser>("adminUsers", id, data);
export const deleteAdminUser = (id: string) => remove("adminUsers", id);
export async function getAdminUserByUid(uid: string): Promise<AdminUser | null> {
  const q = query(collection(db, "adminUsers"), where("uid", "==", uid), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as AdminUser;
}

// Dashboard
export async function getDashboardStats() {
  const [services, posts, gallery, clients, messages, apps] = await Promise.all([
    getDocs(collection(db, "services")),
    getDocs(collection(db, "blogPosts")),
    getDocs(collection(db, "galleryItems")),
    getDocs(collection(db, "clientele")),
    getDocs(query(collection(db, "contactMessages"), where("read", "==", false))),
    getDocs(query(collection(db, "resellerApplications"), where("read", "==", false))),
  ]);
  return {
    services: services.size,
    blogPosts: posts.size,
    gallery: gallery.size,
    clientele: clients.size,
    unreadMessages: messages.size,
    unreadApplications: apps.size,
  };
}
