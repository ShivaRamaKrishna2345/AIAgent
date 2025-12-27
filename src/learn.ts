import { loadJSON, saveJSON } from "./store.js";
import { Invoice } from "./types.js";

export function learn(
  invoice: Invoice,
  humanCorrections: any[],
  audit: any[]
) {
  const vendorMemory = loadJSON<any[]>("memory/vendor_memory.json");
  const resolutionMemory = loadJSON<any[]>("memory/resolution_memory.json");

  const hc = humanCorrections.find(h => h.invoiceId === invoice.invoiceId);

  // ❗ Do not learn if no human correction
  if (!hc || !hc.corrections || hc.corrections.length === 0) return;

  hc.corrections.forEach((c: any) => {
    const key = `${invoice.vendor}:${c.field}`;

    let vm = vendorMemory.find(
      m => m.vendor === invoice.vendor && m.field === c.field
    );

    if (!vm) {
      vm = {
        vendor: invoice.vendor,
        field: c.field,
        confidence: 0.75,
        pattern: c.reason
      };
      vendorMemory.push(vm);
    }

    let rm = resolutionMemory.find(m => m.key === key);
    if (!rm) {
      rm = { key, approved: 0, rejected: 0, confidence: vm.confidence };
      resolutionMemory.push(rm);
    }

    if (hc.finalDecision === "approved") {
      rm.approved++;
      rm.confidence = Math.min(0.95, rm.confidence + 0.1);
      vm.confidence = rm.confidence;
      audit.push({ step: "learn", details: `Reinforced memory for ${c.field}` });
    }
  });

  saveJSON("memory/vendor_memory.json", vendorMemory);
  saveJSON("memory/resolution_memory.json", resolutionMemory);
}
