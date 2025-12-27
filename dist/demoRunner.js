import fs from "fs";
import { processInvoice } from "./processor.js";
const invoices = JSON.parse(fs.readFileSync("data/invoices_extracted.json", "utf-8"));
const corrections = JSON.parse(fs.readFileSync("data/human_corrections.json", "utf-8"));
console.log("\n--- Invoice 1 (Before Learning) ---");
console.log(JSON.stringify(processInvoice(invoices[0], corrections), null, 2));
console.log("\n--- Invoice 2 (After Learning) ---");
console.log(JSON.stringify(processInvoice(invoices[1], corrections), null, 2));
