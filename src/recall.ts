import { Invoice, MemoryRecord } from "./types.js";
import { loadJSON } from "./store.js";

export function recallMemory(invoice: Invoice): MemoryRecord[] {
  const memory = loadJSON<MemoryRecord[]>("memory/vendor_memory.json");
  return memory.filter(m => m.vendor === invoice.vendor);
}
