export type AuditStep = "recall" | "apply" | "decide" | "learn";

export interface Invoice {
  invoiceId: string;
  vendor: string;
  fields: any;
  confidence: number;
  rawText: string;
}

export interface MemoryRecord {
  vendor: string;
  type: string;
  value: any;
  confidence: number;
}

export interface AuditEntry {
  step: AuditStep;
  timestamp: string;
  details: string;
}
