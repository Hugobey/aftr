export function parseJoinCode(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  // Try URL parsing first (handles ?code= and path)
  try {
    const withScheme = /^https?:\/\//i.test(value)
      ? value
      : value.includes('.') || value.startsWith('aftr:')
        ? value
        : null;

    if (withScheme && (withScheme.startsWith('http') || withScheme.startsWith('aftr:'))) {
      // Query: https://joinaftr.app/join?code=C7TO3
      if (/^https?:\/\//i.test(withScheme)) {
        const url = new URL(withScheme);
        const fromQuery = url.searchParams.get('code');
        if (fromQuery && /^[A-Z0-9]{4,12}$/i.test(fromQuery)) {
          return fromQuery.toUpperCase();
        }
        // Path: https://joinaftr.app/join/C7TO3
        const pathMatch = url.pathname.match(/\/join\/([A-Z0-9]{4,12})\/?$/i);
        if (pathMatch?.[1]) return pathMatch[1].toUpperCase();
      }
    }
  } catch {
    // fall through
  }

  // https://joinaftr.app/join?code=C7TO3 (string fallback)
  const query = value.match(/[?&]code=([A-Z0-9]{4,12})/i);
  if (query?.[1]) return query[1].toUpperCase();

  // https://joinaftr.app/join/C7TO3
  const webPath = value.match(/joinaftr\.app\/join\/([A-Z0-9]{4,12})/i);
  if (webPath?.[1]) return webPath[1].toUpperCase();

  // aftr://join/C7TO3
  const scheme = value.match(/aftr:\/\/join\/([A-Z0-9]{4,12})/i);
  if (scheme?.[1]) return scheme[1].toUpperCase();

  // Bare code
  if (/^[A-Z0-9]{4,12}$/i.test(value)) return value.toUpperCase();

  return null;
}