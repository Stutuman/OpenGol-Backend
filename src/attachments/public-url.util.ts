export const normalizePublicBaseUrl = (value: string): string =>
  value.trim().replace(/\/+$/, '');

export const normalizePublicAssetUrl = (
  value: string | null | undefined,
): string | null => {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  try {
    const url = new URL(trimmedValue);
    url.pathname = url.pathname.replace(/\/{2,}/g, '/');
    return url.toString();
  } catch {
    return trimmedValue.replace(/(^|[^:])\/{2,}/g, '$1/');
  }
};
