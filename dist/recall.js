import { loadJSON } from "./store.js";
export function recallMemory(invoice) {
    const memory = loadJSON("memory/vendor_memory.json");
    return memory.filter(m => m.vendor === invoice.vendor);
}
