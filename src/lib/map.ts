export const getMapSrc = (input: string) => {
  if (!input) return "";

  const trimmed = input.trim();

  // 1. If already an embed URL → use as is
  if (trimmed.includes("output=embed")) {
    return trimmed;
  }

  // 2. If it's a Google Maps URL
  if (trimmed.includes("google.com/maps")) {
    // Extract coordinates (@lat,lng)
    const coordMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    }

    // Extract query param (?q=...)
    const qMatch = trimmed.match(/[?&]q=([^&]+)/);
    if (qMatch) {
      return `https://www.google.com/maps?q=${qMatch[1]}&output=embed`;
    }

    // Extract place name from /place/
    const placeMatch = trimmed.match(/\/place\/([^/]+)/);
    if (placeMatch) {
      const place = decodeURIComponent(placeMatch[1]);
      return `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
    }

    // Fallback → treat full URL as query
    return `https://www.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
  }

  // 3. Plain text (e.g. "Emlaak Developers")
  return `https://www.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
};