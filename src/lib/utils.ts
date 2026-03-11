// Utility functions for deduplication and string matching

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");
};

export const calculateLevenshteinDistance = (
  str1: string,
  str2: string,
): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  const maxLength = Math.max(str1.length, str2.length);
  return 1 - matrix[str2.length][str1.length] / maxLength;
};

export const areSimilar = (
  str1: string,
  str2: string,
  threshold: number = 0.85,
): boolean => {
  const norm1 = normalizeString(str1);
  const norm2 = normalizeString(str2);
  const similarity = calculateLevenshteinDistance(norm1, norm2);
  return similarity > threshold;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91-${cleaned}`;
  }
  return phone;
};

export const formatDate = (date: string | Date): string => {
  try {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date.toString();
  }
};
