
export function parseJoinCode(raw: string): string | null {
  const value = raw.trim();

  // https://joinaftr.app/join/ABC123
  const web = value.match(/(?:join)?aftr\.app\/join\/([A-Z0-9]+)/i);
  if (web?.[1]) return web[1].toUpperCase();

  // aftr://join/ABC123
  const scheme = value.match(/aftr:\/\/join\/([A-Z0-9]+)/i);
  if (scheme?.[1]) return scheme[1].toUpperCase();

  // bare code
  if (/^[A-Z0-9]{4,10}$/i.test(value)) return value.toUpperCase();

  return null;
}
