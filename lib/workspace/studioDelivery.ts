/** Shared project delivery vocabulary; keep existing values for legacy records. */
export const DELIVERABLE_CATEGORIES = [
  "Architectural Drawing",
  "Civil Drawing",
  "Model",
  "Render",
  "Report",
  "Contract",
  "Deliverable",
  "Site Photo",
  "Document",
  "Brand Strategy",
  "Brand Identity",
  "Brand Guidelines",
  "Creative Direction",
  "Presentation",
  "Animation",
  "Video",
  "UX/UI Design",
  "Website Deliverable",
  "Digital Asset",
  "Other",
] as const;

/**
 * Additive stage vocabulary that supports multiple studio disciplines.
 * A future project-service migration will store independent stages per
 * workstream; this list does not rewrite any existing project records.
 */
export const PROJECT_PHASES = [
  "Discovery & Brief",
  "Concept Design",
  "Brand Strategy",
  "Creative Development",
  "Design Development",
  "Technical Design",
  "Production",
  "Review & Approval",
  "Tender",
  "Construction",
  "Handover",
  "Launch & Support",
] as const;

export const STUDIO_SERVICES = [
  "Architecture & Interiors",
  "Branding & Creative Direction",
  "Visualization & Communication",
  "Digital Experiences",
] as const;
