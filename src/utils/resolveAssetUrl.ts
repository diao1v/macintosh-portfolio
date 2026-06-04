const ABSOLUTE_URL = /^https?:\/\//i;

/**
 * Resolve a project media reference to a usable URL.
 * - Absolute URLs (http/https) are returned unchanged — keeps existing
 *   Cloudinary images and YouTube embeds working.
 * - Bare keys are served from the Cloudflare R2 custom domain in
 *   VITE_ASSET_BASE, e.g. "cheater-encoder/shot-1.png".
 */
export const resolveAssetUrl = (src: string): string => {
  if (ABSOLUTE_URL.test(src)) return src;
  const base = (import.meta.env.VITE_ASSET_BASE ?? '').replace(/\/+$/, '');
  const key = src.replace(/^\/+/, '');
  return base ? `${base}/${key}` : `/${key}`;
};
