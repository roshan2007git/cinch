// Plan limits — must match components/sections/pricing-section.tsx exactly.

export type Plan = "free" | "atelier" | "label";

interface PlanLimits {
  generationsPerMonth: number | null; // null = unlimited
  variationsPerDesign: number;
  savedProjects: number | null; // null = unlimited
}

const LIMITS: Record<Plan, PlanLimits> = {
  free: {
    generationsPerMonth: 5,
    variationsPerDesign: 3,
    savedProjects: 3,
  },
  atelier: {
    generationsPerMonth: null,
    variationsPerDesign: 5,
    savedProjects: null,
  },
  label: {
    generationsPerMonth: null,
    variationsPerDesign: 5,
    savedProjects: null,
  },
};

export function getLimits(plan: Plan): PlanLimits {
  return LIMITS[plan];
}

export function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
