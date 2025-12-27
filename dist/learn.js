import { loadJSON, saveJSON } from "./store.js";
export function learn(invoice, humanCorrections, audit) {
    const vendorMemory = loadJSON("memory/vendor_memory.json");
    const resolutionMemory = loadJSON("memory/resolution_memory.json");
    const hc = humanCorrections.find(h => h.invoiceId === invoice.invoiceId);
    // ❗ DO NOT LEARN IF NO HUMAN CORRECTION
    if (!hc || !hc.corrections || hc.corrections.length === 0) {
        return;
    }
    hc.corrections.forEach((c) => {
        const memoryKey = `${invoice.vendor}:${c.field}`;
        // --- Vendor Memory ---
        let vm = vendorMemory.find(m => m.vendor === invoice.vendor && m.field === c.field);
        if (!vm) {
            vm = {
                vendor: invoice.vendor,
                field: c.field,
                pattern: c.reason,
                confidence: 0.75
            };
            vendorMemory.push(vm);
        }
        // --- Resolution Memory ---
        let rm = resolutionMemory.find(m => m.memoryKey === memoryKey);
        if (!rm) {
            rm = {
                memoryKey,
                approved: 0,
                rejected: 0,
                confidence: vm.confidence
            };
            resolutionMemory.push(rm);
        }
        if (hc.finalDecision === "approved") {
            rm.approved += 1;
            rm.confidence = Math.min(0.95, rm.confidence + 0.1);
            vm.confidence = rm.confidence;
            audit.push({
                step: "learn",
                details: `Reinforced memory for ${c.field}`
            });
        }
        else {
            rm.rejected += 1;
            rm.confidence = Math.max(0.4, rm.confidence - 0.15);
            vm.confidence = rm.confidence;
            audit.push({
                step: "learn",
                details: `Decayed memory for ${c.field}`
            });
        }
    });
    saveJSON("memory/vendor_memory.json", vendorMemory);
    saveJSON("memory/resolution_memory.json", resolutionMemory);
}
