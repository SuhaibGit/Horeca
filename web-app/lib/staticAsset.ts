/** Bump when replacing files in /public that keep the same path and filename. */
export const ASSET_CACHE_VERSION = "20260610";

export function staticAssetUrl(path: string) {
  const encoded = path.replace(/ /g, "%20");
  const separator = encoded.includes("?") ? "&" : "?";
  return `${encoded}${separator}v=${ASSET_CACHE_VERSION}`;
}
