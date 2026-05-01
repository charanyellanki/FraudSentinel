export type Tone = "neutral" | "success" | "warning" | "danger" | "info";

export function labelTone(label: string): Tone {
  if (label === "legit" || label === "approve" || label === "low" || label === "stable") return "success";
  if (label === "borderline" || label === "review" || label === "medium" || label === "warning") return "warning";
  if (label === "fraud" || label === "decline" || label === "high" || label === "drift") return "danger";
  return "neutral";
}
