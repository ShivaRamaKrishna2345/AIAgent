import { Invoice } from "./types.js";

export function applyMemory(
  invoice: Invoice,
  memories: any[],
  audit: any[]
) {
  const fields = { ...invoice.fields };
  const raw = invoice.rawText.toLowerCase();
  let confidence = invoice.confidence;
  const proposed: string[] = [];

  // --- Supplier GmbH: Leistungsdatum → serviceDate ---
  const serviceDateMem = memories.find(
    m => m.field === "serviceDate" && m.confidence >= 0.75
  );

  if (!fields.serviceDate && serviceDateMem && raw.includes("leistungsdatum")) {
    const date = raw
      .split("leistungsdatum")[1]
      ?.split("\n")[0]
      ?.replace(":", "")
      ?.trim();

    if (date) {
      fields.serviceDate = date;
      proposed.push("Filled serviceDate from Leistungsdatum");
      confidence += 0.1;

      audit.push({
        step: "apply",
        details: "Leistungsdatum → serviceDate"
      });
    }
  }

  return {
    fields,
    proposed,
    confidence: +Math.min(confidence, 0.95).toFixed(2)
  };
}
