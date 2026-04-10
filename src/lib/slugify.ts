export const slugify = (text: string, maxLength = 60) =>
  text
    .toLowerCase()
    .trim()
    // normalize accented chars (é → e)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // replace common symbols with words
    .replace(/&/g, " and ")
    // remove invalid chars (keep letters, numbers, spaces, hyphens)
    .replace(/[^a-z0-9\s-]/g, "")
    // replace whitespace with hyphen
    .replace(/\s+/g, "-")
    // collapse multiple hyphens
    .replace(/-+/g, "-")
    // trim hyphens from ends
    .replace(/^-+|-+$/g, "")
    // limit length (important for SEO)
    .slice(0, maxLength)
    // remove trailing hyphen after slice
    .replace(/-+$/g, "");