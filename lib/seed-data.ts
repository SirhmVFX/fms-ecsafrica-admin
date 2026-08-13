import type {
  AboutPageContent,
  AccreditationPageContent,
  BenefitsPageContent,
  BlogPost,
  ClienteleItem,
  ContactPageContent,
  CsrInitiative,
  CsrPageContent,
  GalleryItem,
  GalleryPageContent,
  BlogPageContent,
  ClientelePageContent,
  HeroSlide,
  HomepageContent,
  PrivacyPageContent,
  ResellersPageContent,
  Service,
  SiteSettings,
} from "./types";
import payload from "./seed-payload.json";

export const emptySiteSettings: Omit<SiteSettings, "id" | "updatedAt"> = {
  siteName: "",
  siteDescription: "",
  logoUrl: "",
  headerTagline: "",
  headerPhone: "",
  loginLabel: "Login",
  loginUrl: "",
  footerBlurb: "",
  footerPhone: "",
  footerWhatsapp: "",
  contactPageUrl: "/about-us/contact-us",
  designCreditLabel: "",
  designCreditUrl: "",
  footerCopyright: "",
  facebookUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",
  instagramUrl: "",
  regionalPhones: [],
  aboutLinks: [],
  primaryLinks: [],
  footerQuickLinks: [],
  footerPortalLinks: [],
  footerFeaturedProducts: [],
  ctaImage: "",
  ctaHeadline: "",
  ctaBody: "",
  ctaButtonLabel: "",
  ctaHref: "",
};

export const seedSiteSettings = payload.siteSettings as Omit<
  SiteSettings,
  "id" | "updatedAt"
>;

export const seedHeroSlides = payload.heroSlides as Omit<
  HeroSlide,
  "id" | "createdAt" | "updatedAt"
>[];

export const seedHomepage = payload.homepage as Omit<
  HomepageContent,
  "id" | "updatedAt"
>;

export const seedAboutPage = payload.aboutPage as Omit<
  AboutPageContent,
  "id" | "updatedAt"
>;

export const seedAccreditationPage = payload.accreditationPage as Omit<
  AccreditationPageContent,
  "id" | "updatedAt"
>;

export const seedCsrPage = payload.csrPage as Omit<
  CsrPageContent,
  "id" | "updatedAt"
>;

export const seedCsrInitiatives = payload.csrInitiatives as Omit<
  CsrInitiative,
  "id" | "createdAt" | "updatedAt"
>[];

export const seedBenefitsPage = payload.benefitsPage as Omit<
  BenefitsPageContent,
  "id" | "updatedAt"
>;

export const seedResellersPage = payload.resellersPage as Omit<
  ResellersPageContent,
  "id" | "updatedAt"
>;

export const seedContactPage = payload.contactPage as Omit<
  ContactPageContent,
  "id" | "updatedAt"
>;

export const seedPrivacyPage = payload.privacyPage as Omit<
  PrivacyPageContent,
  "id" | "updatedAt"
>;

export const seedServices = payload.services as Omit<
  Service,
  "id" | "createdAt" | "updatedAt"
>[];

export const seedBlogPosts = payload.blogPosts as Omit<
  BlogPost,
  "id" | "createdAt" | "updatedAt"
>[];

export const seedGalleryItems = payload.galleryItems as Omit<
  GalleryItem,
  "id" | "createdAt" | "updatedAt"
>[];

export const seedClientele = payload.clientele as Omit<
  ClienteleItem,
  "id" | "createdAt" | "updatedAt"
>[];

export const seedGalleryPage = payload.galleryPage as Omit<
  GalleryPageContent,
  "id" | "updatedAt"
>;

export const seedBlogPage = payload.blogPage as Omit<
  BlogPageContent,
  "id" | "updatedAt"
>;

export const seedClientelePage = payload.clientelePage as Omit<
  ClientelePageContent,
  "id" | "updatedAt"
>;

export type SeedSectionId =
  | "siteSettings"
  | "heroSlides"
  | "homepage"
  | "aboutPage"
  | "accreditationPage"
  | "csrPage"
  | "csrInitiatives"
  | "benefitsPage"
  | "resellersPage"
  | "contactPage"
  | "privacyPage"
  | "galleryPage"
  | "blogPage"
  | "clientelePage"
  | "services"
  | "blogPosts"
  | "galleryItems"
  | "clientele";

export const seedSections: {
  id: SeedSectionId;
  label: string;
  kind: "singleton" | "collection";
  collection: string;
  count: number;
}[] = [
  {
    id: "siteSettings",
    label: "Site Settings",
    kind: "singleton",
    collection: "siteSettings",
    count: 1,
  },
  {
    id: "heroSlides",
    label: "Hero Slides",
    kind: "collection",
    collection: "heroSlides",
    count: seedHeroSlides.length,
  },
  {
    id: "homepage",
    label: "Homepage",
    kind: "singleton",
    collection: "homepage",
    count: 1,
  },
  {
    id: "aboutPage",
    label: "About Page",
    kind: "singleton",
    collection: "aboutPage",
    count: 1,
  },
  {
    id: "accreditationPage",
    label: "Accreditation Page",
    kind: "singleton",
    collection: "accreditationPage",
    count: 1,
  },
  {
    id: "csrPage",
    label: "CSR Page",
    kind: "singleton",
    collection: "csrPage",
    count: 1,
  },
  {
    id: "csrInitiatives",
    label: "CSR Initiatives",
    kind: "collection",
    collection: "csrInitiatives",
    count: seedCsrInitiatives.length,
  },
  {
    id: "benefitsPage",
    label: "Benefits Page",
    kind: "singleton",
    collection: "benefitsPage",
    count: 1,
  },
  {
    id: "resellersPage",
    label: "Resellers Page",
    kind: "singleton",
    collection: "resellersPage",
    count: 1,
  },
  {
    id: "contactPage",
    label: "Contact Page",
    kind: "singleton",
    collection: "contactPage",
    count: 1,
  },
  {
    id: "privacyPage",
    label: "Privacy Page",
    kind: "singleton",
    collection: "privacyPage",
    count: 1,
  },
  {
    id: "galleryPage",
    label: "Gallery Page",
    kind: "singleton",
    collection: "galleryPage",
    count: 1,
  },
  {
    id: "blogPage",
    label: "Blog Listing",
    kind: "singleton",
    collection: "blogPage",
    count: 1,
  },
  {
    id: "clientelePage",
    label: "Clientele Listing",
    kind: "singleton",
    collection: "clientelePage",
    count: 1,
  },
  {
    id: "services",
    label: "Services",
    kind: "collection",
    collection: "services",
    count: seedServices.length,
  },
  {
    id: "blogPosts",
    label: "Blog Posts",
    kind: "collection",
    collection: "blogPosts",
    count: seedBlogPosts.length,
  },
  {
    id: "galleryItems",
    label: "Gallery Items",
    kind: "collection",
    collection: "galleryItems",
    count: seedGalleryItems.length,
  },
  {
    id: "clientele",
    label: "Clientele",
    kind: "collection",
    collection: "clientele",
    count: seedClientele.length,
  },
];
