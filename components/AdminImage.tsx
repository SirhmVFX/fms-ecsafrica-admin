"use client";

type Props = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Plain img for admin previews. Avoids next/image host restrictions and works
 * with Cloudinary URLs, absolute URLs, and local /assets paths (via public symlink).
 */
export default function AdminImage({
  src,
  alt = "",
  width,
  height,
  className,
}: Props) {
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );
}
