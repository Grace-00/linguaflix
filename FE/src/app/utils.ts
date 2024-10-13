import path from "path";

export const TMDB_API_KEY = process.env.TMDB_API_KEY;
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const getFilePath = (relativePath: string): string => {
  return path.resolve(__dirname, relativePath);
};

//TODO: non-western characters?
export const normalizeString = (str: string) => {
  // Remove accents
  const accents = [
    { base: "a", letters: /[áàâãäå]/g },
    { base: "e", letters: /[éèêë]/g },
    { base: "i", letters: /[íìîï]/g },
    { base: "o", letters: /[óòôõö]/g },
    { base: "u", letters: /[úùûü]/g },
    { base: "c", letters: /[ç]/g },
    { base: "n", letters: /[ñ]/g },
  ];

  // Normalize the string
  let normalized = str.toLowerCase();
  accents.forEach((accent) => {
    normalized = normalized.replace(accent.letters, accent.base);
  });

  // Remove hyphens and keep spaces
  normalized = normalized.replace(/[-]/g, "");

  return normalized;
};
