// Frontend configuration constants

export const DOCUMENT_TYPES = [
  { value: "AADHAAR", label: "Aadhaar Card", color: "bg-blue-500" },
  { value: "PAN", label: "PAN Card", color: "bg-green-500" },
  { value: "PASSPORT", label: "Passport", color: "bg-purple-500" },
  { value: "TENTH", label: "10th Marksheet", color: "bg-yellow-500" },
  { value: "INTER", label: "Intermediate", color: "bg-orange-500" },
  { value: "DEGREE", label: "Degree Certificate", color: "bg-red-500" },
];

export const VAULT_SECTIONS = {
  PERSONAL_MASTER: { label: "Personal Master", authority: 100 },
  AADHAAR_SECTION: { label: "Aadhaar Section", authority: 95 },
  PASSPORT_SECTION: { label: "Passport Section", authority: 90 },
  PAN_SECTION: { label: "PAN Section", authority: 85 },
  EDUCATION_10TH: { label: "10th Marksheet", authority: 70 },
  EDUCATION_INTER: { label: "Intermediate", authority: 70 },
  EDUCATION_DEGREE: { label: "Degree", authority: 70 },
};

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 85,
  MEDIUM: 70,
  LOW: 50,
};

export const API_CONFIG = {
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",
};

export const FIELD_FORMATS = {
  PHONE: "phone",
  DATE: "date",
  EMAIL: "email",
  NAME: "name",
  NUMBER: "number",
};
