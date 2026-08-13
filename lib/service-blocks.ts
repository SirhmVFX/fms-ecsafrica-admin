export type ServiceBlock = Record<string, unknown> & { type: string };

export type FeatureItem = {
  title: string;
  description: string;
  image?: string;
};

export const SECTION_TYPES: {
  type: string;
  label: string;
  hint: string;
}[] = [
  { type: "intro", label: "Text", hint: "One or more paragraphs" },
  { type: "heading", label: "Heading", hint: "A section title" },
  { type: "steps", label: "Numbered steps", hint: "How it works, 1–2–3" },
  { type: "features", label: "Feature cards", hint: "Grid of titled cards" },
  { type: "split", label: "Photo beside text", hint: "Image on one side, copy on the other" },
  { type: "image", label: "Large image", hint: "A full-width photo" },
  { type: "gallery", label: "Photo grid", hint: "Several photos in a row" },
  { type: "list", label: "Bullet list", hint: "Simple list of points" },
  { type: "numbered-list", label: "Numbered list", hint: "Ordered list of points" },
  { type: "subsection", label: "Titled section", hint: "Heading, text, optional photo and cards" },
  { type: "tabs", label: "Tabs", hint: "Switch between topics" },
  { type: "accordion", label: "Expandable list", hint: "Click to open each item" },
  { type: "before-after", label: "Before & after", hint: "Two lists you can toggle" },
  { type: "comparison", label: "Side-by-side comparison", hint: "Two options compared" },
  { type: "interactive-gallery", label: "Featured gallery", hint: "Large photo plus thumbnails" },
  { type: "stats", label: "Statistics", hint: "Big numbers and labels" },
];

export function sectionLabel(type: string) {
  return SECTION_TYPES.find((t) => t.type === type)?.label || type;
}

export function emptySection(type: string): ServiceBlock {
  switch (type) {
    case "intro":
      return { type, paragraphs: [""] };
    case "heading":
      return { type, title: "", subtitle: "" };
    case "steps":
      return {
        type,
        steps: [{ number: 1, title: "", description: "" }],
      };
    case "features":
      return {
        type,
        columns: 3,
        features: [{ title: "", description: "", image: "" }],
      };
    case "split":
      return {
        type,
        title: "",
        paragraphs: [""],
        image: "",
        imageAlt: "",
        reverse: false,
      };
    case "image":
      return { type, src: "", alt: "", caption: "" };
    case "gallery":
      return {
        type,
        columns: 3,
        images: [{ src: "", alt: "" }],
      };
    case "list":
    case "numbered-list":
      return { type, title: "", items: [""] };
    case "subsection":
      return {
        type,
        title: "",
        subtitle: "",
        paragraphs: [""],
        image: "",
        imageAlt: "",
        features: [],
      };
    case "tabs":
      return {
        type,
        title: "",
        tabs: [{ label: "Tab 1", paragraphs: [""], items: [], image: "", imageAlt: "" }],
      };
    case "accordion":
      return {
        type,
        title: "",
        items: [{ title: "", description: "", image: "", imageAlt: "" }],
      };
    case "before-after":
      return {
        type,
        title: "",
        beforeLabel: "Before",
        afterLabel: "After",
        before: [""],
        after: [""],
        image: "",
        imageAlt: "",
      };
    case "comparison":
      return {
        type,
        title: "",
        leftTitle: "",
        rightTitle: "",
        leftImage: "",
        rightImage: "",
        leftFeatures: [{ title: "", description: "" }],
        rightFeatures: [{ title: "", description: "" }],
      };
    case "interactive-gallery":
      return {
        type,
        title: "",
        images: [{ src: "", alt: "", caption: "" }],
      };
    case "stats":
      return {
        type,
        title: "",
        stats: [{ value: "", label: "" }],
      };
    default:
      return { type, paragraphs: [""] };
  }
}

export function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function asBool(value: unknown) {
  return Boolean(value);
}

export function asNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item ?? ""));
}

export function asFeatures(value: unknown): FeatureItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      title: asString(row.title),
      description: asString(row.description),
      image: asString(row.image),
    };
  });
}

export function linesToList(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function paragraphsFromText(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
