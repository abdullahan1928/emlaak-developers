export const getPublicIdFromUrl = (url: string) => {
  if (!url) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    // remove version (v123...) if present
    const path = parts[1].split("/");
    if (path[0].startsWith("v")) {
      path.shift();
    }

    const fullPath = path.join("/");

    // remove extension
    return fullPath.replace(/\.[^/.]+$/, "");
  } catch (err) {
    return null;
  }
};