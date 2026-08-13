"use client";

import ImageUpload from "@/components/ImageUpload";
import {
  asBool,
  asFeatures,
  asNumber,
  asString,
  asStringList,
  emptySection,
  linesToList,
  paragraphsFromText,
  SECTION_TYPES,
  sectionLabel,
  type FeatureItem,
  type ServiceBlock,
} from "@/lib/service-blocks";
import {
  MdAdd,
  MdArrowDownward,
  MdArrowUpward,
  MdDelete,
} from "react-icons/md";

type Props = {
  blocks: ServiceBlock[];
  onChange: (blocks: ServiceBlock[]) => void;
};

function patch<T extends ServiceBlock>(
  blocks: ServiceBlock[],
  index: number,
  updates: Partial<T>,
): ServiceBlock[] {
  return blocks.map((block, i) =>
    i === index ? { ...block, ...updates } : block,
  );
}

function FeatureRows({
  items,
  onChange,
}: {
  items: FeatureItem[];
  onChange: (items: FeatureItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-100 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Card {i + 1}</p>
            <button
              type="button"
              className="btn-danger py-1 px-2"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              <MdDelete size={14} />
            </button>
          </div>
          <input
            className="admin-input"
            placeholder="Title"
            value={item.title}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, title: e.target.value };
              onChange(next);
            }}
          />
          <textarea
            className="admin-input"
            rows={2}
            placeholder="Description"
            value={item.description}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, description: e.target.value };
              onChange(next);
            }}
          />
          <ImageUpload
            label="Optional image"
            value={item.image || ""}
            onChange={(url) => {
              const next = [...items];
              next[i] = { ...item, image: url };
              onChange(next);
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn-secondary text-xs py-1.5"
        onClick={() =>
          onChange([...items, { title: "", description: "", image: "" }])
        }
      >
        <MdAdd size={14} className="inline" /> Add card
      </button>
    </div>
  );
}

function ImageRows({
  items,
  onChange,
  withCaption,
}: {
  items: { src: string; alt: string; caption?: string }[];
  onChange: (items: { src: string; alt: string; caption?: string }[]) => void;
  withCaption?: boolean;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-100 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Photo {i + 1}</p>
            <button
              type="button"
              className="btn-danger py-1 px-2"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              <MdDelete size={14} />
            </button>
          </div>
          <ImageUpload
            label="Photo"
            value={item.src}
            onChange={(url) => {
              const next = [...items];
              next[i] = { ...item, src: url };
              onChange(next);
            }}
          />
          <input
            className="admin-input"
            placeholder="Short description of the photo"
            value={item.alt}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, alt: e.target.value };
              onChange(next);
            }}
          />
          {withCaption && (
            <input
              className="admin-input"
              placeholder="Caption (optional)"
              value={item.caption || ""}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, caption: e.target.value };
                onChange(next);
              }}
            />
          )}
        </div>
      ))}
      <button
        type="button"
        className="btn-secondary text-xs py-1.5"
        onClick={() => onChange([...items, { src: "", alt: "", caption: "" }])}
      >
        <MdAdd size={14} className="inline" /> Add photo
      </button>
    </div>
  );
}

function BlockFields({
  block,
  onPatch,
}: {
  block: ServiceBlock;
  onPatch: (updates: Partial<ServiceBlock>) => void;
}) {
  const type = asString(block.type);

  if (type === "intro") {
    return (
      <div>
        <label className="admin-label">Paragraphs</label>
        <textarea
          className="admin-input"
          rows={5}
          value={asStringList(block.paragraphs).join("\n\n")}
          onChange={(e) =>
            onPatch({ paragraphs: paragraphsFromText(e.target.value) })
          }
          placeholder="Write the text. Leave a blank line between paragraphs."
        />
      </div>
    );
  }

  if (type === "heading") {
    return (
      <div className="space-y-3">
        <div>
          <label className="admin-label">Heading</label>
          <input
            className="admin-input"
            value={asString(block.title)}
            onChange={(e) => onPatch({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Optional subtitle</label>
          <input
            className="admin-input"
            value={asString(block.subtitle)}
            onChange={(e) => onPatch({ subtitle: e.target.value })}
          />
        </div>
      </div>
    );
  }

  if (type === "list" || type === "numbered-list") {
    return (
      <div className="space-y-3">
        <div>
          <label className="admin-label">Optional heading</label>
          <input
            className="admin-input"
            value={asString(block.title)}
            onChange={(e) => onPatch({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Items (one per line)</label>
          <textarea
            className="admin-input"
            rows={5}
            value={asStringList(block.items).join("\n")}
            onChange={(e) => onPatch({ items: linesToList(e.target.value) })}
          />
        </div>
      </div>
    );
  }

  if (type === "image") {
    return (
      <div className="space-y-3">
        <ImageUpload
          label="Image"
          value={asString(block.src)}
          onChange={(url) => onPatch({ src: url })}
        />
        <input
          className="admin-input"
          placeholder="Short description of the image"
          value={asString(block.alt)}
          onChange={(e) => onPatch({ alt: e.target.value })}
        />
        <input
          className="admin-input"
          placeholder="Caption (optional)"
          value={asString(block.caption)}
          onChange={(e) => onPatch({ caption: e.target.value })}
        />
      </div>
    );
  }

  if (type === "split") {
    return (
      <div className="space-y-3">
        <input
          className="admin-input"
          placeholder="Heading (optional)"
          value={asString(block.title)}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
        <textarea
          className="admin-input"
          rows={4}
          placeholder="Text. Leave a blank line between paragraphs."
          value={asStringList(block.paragraphs).join("\n\n")}
          onChange={(e) =>
            onPatch({ paragraphs: paragraphsFromText(e.target.value) })
          }
        />
        <ImageUpload
          label="Photo"
          value={asString(block.image)}
          onChange={(url) => onPatch({ image: url })}
        />
        <input
          className="admin-input"
          placeholder="Short description of the photo"
          value={asString(block.imageAlt)}
          onChange={(e) => onPatch({ imageAlt: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={asBool(block.reverse)}
            onChange={(e) => onPatch({ reverse: e.target.checked })}
          />
          Photo on the left
        </label>
      </div>
    );
  }

  if (type === "features") {
    return (
      <div className="space-y-3">
        <div>
          <label className="admin-label">Cards per row</label>
          <select
            className="admin-input"
            value={asNumber(block.columns, 3)}
            onChange={(e) => onPatch({ columns: Number(e.target.value) })}
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        <FeatureRows
          items={asFeatures(block.features)}
          onChange={(features) => onPatch({ features })}
        />
      </div>
    );
  }

  if (type === "steps") {
    const steps = Array.isArray(block.steps)
      ? (block.steps as Record<string, unknown>[])
      : [];
    return (
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500">
                Step {i + 1}
              </p>
              <button
                type="button"
                className="btn-danger py-1 px-2"
                onClick={() =>
                  onPatch({ steps: steps.filter((_, j) => j !== i) })
                }
              >
                <MdDelete size={14} />
              </button>
            </div>
            <input
              className="admin-input"
              placeholder="Title"
              value={asString(step.title)}
              onChange={(e) => {
                const next = [...steps];
                next[i] = { ...step, number: i + 1, title: e.target.value };
                onPatch({ steps: next });
              }}
            />
            <textarea
              className="admin-input"
              rows={2}
              placeholder="Description"
              value={asString(step.description)}
              onChange={(e) => {
                const next = [...steps];
                next[i] = {
                  ...step,
                  number: i + 1,
                  description: e.target.value,
                };
                onPatch({ steps: next });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary text-xs py-1.5"
          onClick={() =>
            onPatch({
              steps: [
                ...steps,
                { number: steps.length + 1, title: "", description: "" },
              ],
            })
          }
        >
          <MdAdd size={14} className="inline" /> Add step
        </button>
      </div>
    );
  }

  if (type === "gallery" || type === "interactive-gallery") {
    const images = Array.isArray(block.images)
      ? (block.images as { src?: string; alt?: string; caption?: string }[]).map(
          (img) => ({
            src: asString(img.src),
            alt: asString(img.alt),
            caption: asString(img.caption),
          }),
        )
      : [];
    return (
      <div className="space-y-3">
        {type === "interactive-gallery" && (
          <input
            className="admin-input"
            placeholder="Heading (optional)"
            value={asString(block.title)}
            onChange={(e) => onPatch({ title: e.target.value })}
          />
        )}
        {type === "gallery" && (
          <div>
            <label className="admin-label">Photos per row</label>
            <select
              className="admin-input"
              value={asNumber(block.columns, 3)}
              onChange={(e) => onPatch({ columns: Number(e.target.value) })}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
        )}
        <ImageRows
          items={images}
          withCaption={type === "interactive-gallery"}
          onChange={(next) => onPatch({ images: next })}
        />
      </div>
    );
  }

  if (type === "subsection") {
    return (
      <div className="space-y-3">
        <input
          className="admin-input"
          placeholder="Heading"
          value={asString(block.title)}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
        <input
          className="admin-input"
          placeholder="Optional subtitle"
          value={asString(block.subtitle)}
          onChange={(e) => onPatch({ subtitle: e.target.value })}
        />
        <textarea
          className="admin-input"
          rows={4}
          placeholder="Text. Leave a blank line between paragraphs."
          value={asStringList(block.paragraphs).join("\n\n")}
          onChange={(e) =>
            onPatch({ paragraphs: paragraphsFromText(e.target.value) })
          }
        />
        <ImageUpload
          label="Optional photo"
          value={asString(block.image)}
          onChange={(url) => onPatch({ image: url })}
        />
        <input
          className="admin-input"
          placeholder="Short description of the photo"
          value={asString(block.imageAlt)}
          onChange={(e) => onPatch({ imageAlt: e.target.value })}
        />
        <p className="admin-label">Optional cards</p>
        <FeatureRows
          items={asFeatures(block.features)}
          onChange={(features) => onPatch({ features })}
        />
      </div>
    );
  }

  if (type === "accordion") {
    const items = Array.isArray(block.items)
      ? (block.items as Record<string, unknown>[])
      : [];
    return (
      <div className="space-y-3">
        <input
          className="admin-input"
          placeholder="Heading (optional)"
          value={asString(block.title)}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
        {items.map((item, i) => (
          <div key={i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500">Item {i + 1}</p>
              <button
                type="button"
                className="btn-danger py-1 px-2"
                onClick={() =>
                  onPatch({ items: items.filter((_, j) => j !== i) })
                }
              >
                <MdDelete size={14} />
              </button>
            </div>
            <input
              className="admin-input"
              placeholder="Title"
              value={asString(item.title)}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, title: e.target.value };
                onPatch({ items: next });
              }}
            />
            <textarea
              className="admin-input"
              rows={3}
              placeholder="Details"
              value={asString(item.description)}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, description: e.target.value };
                onPatch({ items: next });
              }}
            />
            <ImageUpload
              label="Optional image"
              value={asString(item.image)}
              onChange={(url) => {
                const next = [...items];
                next[i] = { ...item, image: url };
                onPatch({ items: next });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary text-xs py-1.5"
          onClick={() =>
            onPatch({
              items: [
                ...items,
                { title: "", description: "", image: "", imageAlt: "" },
              ],
            })
          }
        >
          <MdAdd size={14} className="inline" /> Add item
        </button>
      </div>
    );
  }

  if (type === "before-after") {
    return (
      <div className="space-y-3">
        <input
          className="admin-input"
          placeholder="Heading (optional)"
          value={asString(block.title)}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="admin-label">Before heading</label>
            <input
              className="admin-input"
              value={asString(block.beforeLabel, "Before")}
              onChange={(e) => onPatch({ beforeLabel: e.target.value })}
            />
            <label className="admin-label mt-3">Before points (one per line)</label>
            <textarea
              className="admin-input"
              rows={5}
              value={asStringList(block.before).join("\n")}
              onChange={(e) => onPatch({ before: linesToList(e.target.value) })}
            />
          </div>
          <div>
            <label className="admin-label">After heading</label>
            <input
              className="admin-input"
              value={asString(block.afterLabel, "After")}
              onChange={(e) => onPatch({ afterLabel: e.target.value })}
            />
            <label className="admin-label mt-3">After points (one per line)</label>
            <textarea
              className="admin-input"
              rows={5}
              value={asStringList(block.after).join("\n")}
              onChange={(e) => onPatch({ after: linesToList(e.target.value) })}
            />
          </div>
        </div>
        <ImageUpload
          label="Optional photo"
          value={asString(block.image)}
          onChange={(url) => onPatch({ image: url })}
        />
      </div>
    );
  }

  if (type === "comparison") {
    return (
      <div className="space-y-4">
        <input
          className="admin-input"
          placeholder="Heading (optional)"
          value={asString(block.title)}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-gray-100 p-3 space-y-3">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Left side
            </p>
            <input
              className="admin-input"
              placeholder="Title"
              value={asString(block.leftTitle)}
              onChange={(e) => onPatch({ leftTitle: e.target.value })}
            />
            <ImageUpload
              label="Optional photo"
              value={asString(block.leftImage)}
              onChange={(url) => onPatch({ leftImage: url })}
            />
            <FeatureRows
              items={asFeatures(block.leftFeatures)}
              onChange={(leftFeatures) => onPatch({ leftFeatures })}
            />
          </div>
          <div className="border border-gray-100 p-3 space-y-3">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Right side
            </p>
            <input
              className="admin-input"
              placeholder="Title"
              value={asString(block.rightTitle)}
              onChange={(e) => onPatch({ rightTitle: e.target.value })}
            />
            <ImageUpload
              label="Optional photo"
              value={asString(block.rightImage)}
              onChange={(url) => onPatch({ rightImage: url })}
            />
            <FeatureRows
              items={asFeatures(block.rightFeatures)}
              onChange={(rightFeatures) => onPatch({ rightFeatures })}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "stats") {
    const stats = Array.isArray(block.stats)
      ? (block.stats as Record<string, unknown>[])
      : [];
    return (
      <div className="space-y-3">
        <input
          className="admin-input"
          placeholder="Heading (optional)"
          value={asString(block.title)}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
        {stats.map((stat, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end">
            <input
              className="admin-input"
              placeholder="Number"
              value={asString(stat.value)}
              onChange={(e) => {
                const next = [...stats];
                next[i] = { ...stat, value: e.target.value };
                onPatch({ stats: next });
              }}
            />
            <input
              className="admin-input"
              placeholder="Label"
              value={asString(stat.label)}
              onChange={(e) => {
                const next = [...stats];
                next[i] = { ...stat, label: e.target.value };
                onPatch({ stats: next });
              }}
            />
            <button
              type="button"
              className="btn-danger py-2 px-2"
              onClick={() => onPatch({ stats: stats.filter((_, j) => j !== i) })}
            >
              <MdDelete size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary text-xs py-1.5"
          onClick={() =>
            onPatch({ stats: [...stats, { value: "", label: "" }] })
          }
        >
          <MdAdd size={14} className="inline" /> Add statistic
        </button>
      </div>
    );
  }

  if (type === "tabs") {
    const tabs = Array.isArray(block.tabs)
      ? (block.tabs as Record<string, unknown>[])
      : [];
    return (
      <div className="space-y-3">
        <input
          className="admin-input"
          placeholder="Heading (optional)"
          value={asString(block.title)}
          onChange={(e) => onPatch({ title: e.target.value })}
        />
        {tabs.map((tab, i) => (
          <div key={i} className="border border-gray-100 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500">Tab {i + 1}</p>
              <button
                type="button"
                className="btn-danger py-1 px-2"
                onClick={() => onPatch({ tabs: tabs.filter((_, j) => j !== i) })}
              >
                <MdDelete size={14} />
              </button>
            </div>
            <input
              className="admin-input"
              placeholder="Tab name"
              value={asString(tab.label)}
              onChange={(e) => {
                const next = [...tabs];
                next[i] = { ...tab, label: e.target.value };
                onPatch({ tabs: next });
              }}
            />
            <textarea
              className="admin-input"
              rows={3}
              placeholder="Text. Leave a blank line between paragraphs."
              value={asStringList(tab.paragraphs).join("\n\n")}
              onChange={(e) => {
                const next = [...tabs];
                next[i] = {
                  ...tab,
                  paragraphs: paragraphsFromText(e.target.value),
                };
                onPatch({ tabs: next });
              }}
            />
            <textarea
              className="admin-input"
              rows={3}
              placeholder="Optional bullet points (one per line)"
              value={asStringList(tab.items).join("\n")}
              onChange={(e) => {
                const next = [...tabs];
                next[i] = { ...tab, items: linesToList(e.target.value) };
                onPatch({ tabs: next });
              }}
            />
            <ImageUpload
              label="Optional photo"
              value={asString(tab.image)}
              onChange={(url) => {
                const next = [...tabs];
                next[i] = { ...tab, image: url };
                onPatch({ tabs: next });
              }}
            />
            <FeatureRows
              items={asFeatures(tab.features)}
              onChange={(features) => {
                const next = [...tabs];
                next[i] = { ...tab, features };
                onPatch({ tabs: next });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary text-xs py-1.5"
          onClick={() =>
            onPatch({
              tabs: [
                ...tabs,
                {
                  label: `Tab ${tabs.length + 1}`,
                  paragraphs: [""],
                  items: [],
                  image: "",
                },
              ],
            })
          }
        >
          <MdAdd size={14} className="inline" /> Add tab
        </button>
      </div>
    );
  }

  return (
    <p className="text-sm text-gray-500">
      This section type is not recognised. Remove it and add a new one.
    </p>
  );
}

export default function ServiceBlocksEditor({ blocks, onChange }: Props) {
  function addSection(type: string) {
    if (!type) return;
    onChange([...blocks, emptySection(type)]);
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...blocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Page content
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Add, edit and rearrange the sections that appear on this service
            page. No technical knowledge needed.
          </p>
        </div>
        <label className="block sm:w-64">
          <span className="admin-label">Add a section</span>
          <select
            className="admin-input"
            defaultValue=""
            onChange={(e) => {
              addSection(e.target.value);
              e.target.value = "";
            }}
          >
            <option value="" disabled>
              Choose a section type…
            </option>
            {SECTION_TYPES.map((item) => (
              <option key={item.type} value={item.type}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {blocks.length === 0 && (
        <div className="border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No sections yet. Choose a section type above to start building the
          page.
        </div>
      )}

      {blocks.map((block, index) => (
        <article key={`${block.type}-${index}`} className="border border-gray-200">
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-slate-50 px-3 py-2">
            <span className="text-xs font-bold text-gray-400">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="flex-1 text-sm font-semibold text-gray-800">
              {sectionLabel(asString(block.type))}
            </h3>
            <button
              type="button"
              className="btn-secondary py-1 px-2"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              title="Move up"
            >
              <MdArrowUpward size={16} />
            </button>
            <button
              type="button"
              className="btn-secondary py-1 px-2"
              onClick={() => move(index, 1)}
              disabled={index === blocks.length - 1}
              title="Move down"
            >
              <MdArrowDownward size={16} />
            </button>
            <button
              type="button"
              className="btn-danger py-1 px-2"
              onClick={() => onChange(blocks.filter((_, i) => i !== index))}
              title="Remove section"
            >
              <MdDelete size={16} />
            </button>
          </div>
          <div className="p-4">
            <BlockFields
              block={block}
              onPatch={(updates) => onChange(patch(blocks, index, updates))}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
