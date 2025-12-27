import { Invoice } from "./types.js";
import { recallMemory } from "./recall.js";
import { applyMemory } from "./apply.js";
import { decide } from "./decide.js";
import { learn } from "./learn.js";

export function processInvoice(
  invoice: Invoice,
  humanCorrections: any[]
) {
  const audit: any[] = [];

  const memories = recallMemory(invoice);
  audit.push({ step: "recall", details: "Fetched vendor memory" });

  const { fields, proposed, confidence } =
    applyMemory(invoice, memories, audit);

  const decision = decide(confidence, proposed);
  audit.push({ step: "decide", details: decision.reasoning });

  learn(invoice, humanCorrections, audit);

  return {
    normalizedInvoice: fields,
    proposedCorrections: proposed,
    requiresHumanReview: decision.requiresHumanReview,
    reasoning: decision.reasoning,
    confidenceScore: confidence,
    memoryUpdates: proposed,
    auditTrail: audit.map(a => ({
      ...a,
      timestamp: new Date().toISOString()
    }))
  };
}
