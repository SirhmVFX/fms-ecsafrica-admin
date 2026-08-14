import { Timestamp } from "firebase/firestore";

export type NavLink = { label: string; href: string };

export interface AdminUser {
  id?: string;
  uid: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface SiteSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  headerTagline: string;
  headerPhone: string;
  loginLabel: string;
  loginUrl: string;
  footerBlurb: string;
  footerPhone: string;
  footerWhatsapp: string;
  contactPageUrl: string;
  designCreditLabel: string;
  designCreditUrl: string;
  footerCopyright: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  regionalPhones: { region: string; phone: string }[];
  aboutLinks: NavLink[];
  primaryLinks: NavLink[];
  footerQuickLinks: NavLink[];
  footerPortalLinks: NavLink[];
  footerFeaturedProducts: NavLink[];
  ctaImage: string;
  ctaHeadline: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaHref: string;
  updatedAt?: Timestamp;
}

export interface HeroSlide {
  id?: string;
  image: string;
  alt: string;
  lineOne: string;
  lineTwo: string;
  body: string;
  order: number;
  active: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface HomepageContent {
  id?: string;
  stats: { value: string; label: string }[];
  missionEyebrow: string;
  missionHeadline: string;
  missionBody: string;
  missionImage: string;
  missionCalloutText: string;
  missionCalloutHref: string;
  solutions: {
    title: string;
    href: string;
    description: string;
    theme: string;
    iconPath: string;
  }[];
  solutionsPhotoHref: string;
  solutionsPhotoImage: string;
  solutionsPhotoTitle: string;
  solutionsEyebrow: string;
  solutionsHeadline: string;
  solutionsCtaLabel: string;
  solutionsCtaHref: string;
  benefits: { title: string; body: string }[];
  pillars: { title: string; body: string }[];
  stories: { company: string; quote: string }[];
  benefitsBandImage: string;
  benefitsBandCtaLabel: string;
  benefitsBandCtaHref: string;
  benefitsEyebrow: string;
  benefitsHeadline: string;
  approachEyebrow: string;
  approachHeadline: string;
  approachCtaLabel: string;
  approachCtaHref: string;
  storiesEyebrow: string;
  storiesHeadline: string;
  pyramidEyebrow: string;
  pyramidHeadline: string;
  pyramidIntro: string;
  pyramidFootnote: string;
  pyramidLevels: { title: string; body: string }[];
  ctaImage: string;
  ctaHeadline: string;
  ctaBody: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  updatedAt?: Timestamp;
}

export interface AboutPageContent {
  id?: string;
  heroHeadline: string;
  intro: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  vision: string;
  mission: string;
  purpose: string;
  coreValues: { title: string; body: string }[];
  trustedBy: string[];
  faqs: { question: string; answer: string }[];
  featuredQuote: string;
  featuredQuoteAuthor: string;
  featuredEyebrow: string;
  featuredHeadline: string;
  pillarsImage: string;
  pillarsEyebrow: string;
  pillarsHeadline: string;
  pillarsCtaLabel: string;
  pillarsCtaHref: string;
  valuesEyebrow: string;
  valuesHeadline: string;
  trustedEyebrow: string;
  faqEyebrow: string;
  faqHeadline: string;
  teamEyebrow: string;
  teamHeadline: string;
  teamIntro: string;
  teamCtaText: string;
  teamCtaLabel: string;
  teamMembers: { initials: string; role: string; dept: string; photo: string }[];
  ctaHeadline: string;
  ctaBody: string;
  ctaImage: string;
  updatedAt?: Timestamp;
}

export interface AccreditationPageContent {
  id?: string;
  heroHeadline: string;
  intro: string;
  heroImage: string;
  certificateImage: string;
  certificateTitle: string;
  highlights: string[];
  commitments: { title: string; body: string }[];
  stats: { value: string; label: string }[];
  ctaHeadline: string;
  ctaBody: string;
  ctaImage: string;
  updatedAt?: Timestamp;
}

export interface CsrInitiative {
  id?: string;
  title: string;
  partner: string;
  description: string;
  image: string;
  category: string;
  featured: boolean;
  order: number;
  active: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CsrPageContent {
  id?: string;
  heroHeadline: string;
  intro: string;
  heroImage: string;
  pillars: { label: string; title: string; body: string }[];
  ctaHeadline: string;
  ctaBody: string;
  ctaImage: string;
  updatedAt?: Timestamp;
}

export interface SlaPackage {
  name: string;
  label: string;
  response: string;
  resolution: string;
  desc: string;
  features: { label: string; value: string; included: boolean }[];
}

export interface BenefitsPageContent {
  id?: string;
  heroHeadline: string;
  intro: string;
  heroImage: string;
  stepsImage: string;
  stepsHeadline: string;
  steps: { number: string; title: string; summary: string; details: string }[];
  industries: { title: string; body: string }[];
  pillars: { title: string; body: string }[];
  stats: { value: string; label: string }[];
  promisesEyebrow: string;
  promisesHeadline: string;
  promisesNote: string;
  promises: string[];
  slaBadge: string;
  slaHeadline: string;
  slaIntro: string;
  slaFootnote: string;
  slaPackages: SlaPackage[];
  ctaHeadline: string;
  ctaBody: string;
  ctaImage: string;
  updatedAt?: Timestamp;
}

export interface ResellersPageContent {
  id?: string;
  badge: string;
  heroHeadline: string;
  heroBody: string;
  heroCtaLabel: string;
  programImage: string;
  whyEyebrow: string;
  whyHeadline: string;
  whyBody: string;
  howEyebrow: string;
  howHeadline: string;
  benefits: { id: string; title: string; summary: string; detail: string }[];
  steps: { step: string; title: string; body: string }[];
  regions: string[];
  testimonials: { quote: string; author: string; company: string }[];
  updatedAt?: Timestamp;
}

export interface GalleryPageContent {
  id?: string;
  heroHeadline: string;
  intro: string;
  heroImage: string;
  updatedAt?: Timestamp;
}

export interface BlogPageContent {
  id?: string;
  heroHeadline: string;
  intro: string;
  updatedAt?: Timestamp;
}

export interface ClientelePageContent {
  id?: string;
  heroHeadline: string;
  intro: string;
  stats: { value: string; label: string }[];
  updatedAt?: Timestamp;
}

export interface ContactPageContent {
  id?: string;
  heroHeadline: string;
  intro: string;
  hqLocation: string;
  hqPhone: string;
  hqEmail: string;
  inquiryCards: {
    id: string;
    title: string;
    description: string;
    email: string;
    href?: string;
    icon: string;
  }[];
  offices: { country: string; phone: string; email: string }[];
  faqs: { question: string; answer: string }[];
  updatedAt?: Timestamp;
}

export interface PrivacyPageContent {
  id?: string;
  heroHeadline: string;
  intro: string;
  sections: { title: string; paragraphs: string[]; list?: string[] }[];
  updatedAt?: Timestamp;
}

export type ServiceBlock = Record<string, unknown> & { type: string };

export interface Service {
  id?: string;
  slug: string;
  title: string;
  tagline?: string;
  metaDescription: string;
  heroImage: string;
  heroImageAlt: string;
  callout?: string;
  blocks: ServiceBlock[];
  navLabel?: string;
  order: number;
  published: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  image: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GalleryItem {
  id?: string;
  src: string;
  title: string;
  category: string;
  order: number;
  active: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ClienteleItem {
  id?: string;
  name: string;
  src: string;
  category: string;
  order: number;
  active: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source?: string;
  read: boolean;
  createdAt?: Timestamp;
}

export interface ResellerApplication {
  id?: string;
  name: string;
  email: string;
  company?: string;
  country: string;
  phone?: string;
  message?: string;
  read: boolean;
  createdAt?: Timestamp;
}
