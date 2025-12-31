export function getAssetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // Ensure the path starts with / if it doesn't
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // If basePath is already starting with it, don't duplicate
  if (basePath && normalizedPath.startsWith(basePath)) {
    return normalizedPath;
  }
  return `${basePath}${normalizedPath}`;
}
