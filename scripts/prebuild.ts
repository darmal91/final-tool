import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 60_000;
const DELAY_BETWEEN_MS = 3000;

interface LeadRow {
  businessName: string;
  businessType: string;
  location: string;
  services: string;
  tone: string;
  differentiator: string;
  primaryColor?: string;
  accentColor?: string;
}

interface ResultRow {
  businessName: string;
  businessId: string;
  status: "ok" | "timeout" | "error";
  previewUrl: string;
  errorMessage: string;
}

function newBusinessId(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function pollForCompletion(businessId: string): Promise<boolean> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE_URL}/api/projects/${businessId}`);
      if (res.ok) {
        const json = (await res.json()) as { project?: unknown };
        if (json.project) return true;
      }
    } catch {
      // server not ready yet
    }
    await sleep(POLL_INTERVAL_MS);
  }
  return false;
}

async function processBusiness(lead: LeadRow, index: number, total: number): Promise<ResultRow> {
  const businessId = newBusinessId();
  const label = `[${index + 1}/${total}] ${lead.businessName}`;

  console.log(`${label} — generating (id: ${businessId})`);

  const services = lead.services.split(/[|,]/).map((s) => s.trim()).filter(Boolean);

  try {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        businessId,
        businessName: lead.businessName,
        businessType: lead.businessType,
        location: lead.location,
        services,
        tone: lead.tone,
        differentiator: lead.differentiator ?? "",
        ...(lead.primaryColor ? { primaryColor: lead.primaryColor } : {}),
        ...(lead.accentColor ? { accentColor: lead.accentColor } : {}),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST failed ${res.status}: ${text}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ${label} — POST error: ${msg}`);
    return {
      businessName: lead.businessName,
      businessId,
      status: "error",
      previewUrl: "",
      errorMessage: msg,
    };
  }

  console.log(`  ${label} — polling…`);
  const done = await pollForCompletion(businessId);

  if (!done) {
    console.error(`  ${label} — timed out after ${POLL_TIMEOUT_MS / 1000}s`);
    return {
      businessName: lead.businessName,
      businessId,
      status: "timeout",
      previewUrl: "",
      errorMessage: `Timed out after ${POLL_TIMEOUT_MS / 1000}s`,
    };
  }

  const previewUrl = `${BASE_URL}/preview/${businessId}`;
  console.log(`  ${label} — done → ${previewUrl}`);

  return {
    businessName: lead.businessName,
    businessId,
    status: "ok",
    previewUrl,
    errorMessage: "",
  };
}

async function main() {
  const leadsPath = path.join(__dirname, "leads.csv");
  const resultsPath = path.join(__dirname, "results.csv");

  if (!fs.existsSync(leadsPath)) {
    console.error(`leads.csv not found at ${leadsPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(leadsPath, "utf8");
  const leads: LeadRow[] = parse(raw, { columns: true, skip_empty_lines: true, trim: true });
  console.log('Parsed rows:', JSON.stringify(leads.slice(0,1), null, 2));

  console.log(`Pre-building ${leads.length} business site(s) against ${BASE_URL}\n`);

  const results: ResultRow[] = [];

  for (let i = 0; i < leads.length; i++) {
    const result = await processBusiness(leads[i], i, leads.length);
    results.push(result);
    if (i < leads.length - 1) {
      console.log(`  waiting ${DELAY_BETWEEN_MS / 1000}s before next…\n`);
      await sleep(DELAY_BETWEEN_MS);
    }
  }

  const header = "businessName,businessId,status,previewUrl,errorMessage";
  const rows = results.map((r) =>
    [r.businessName, r.businessId, r.status, r.previewUrl, r.errorMessage]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  fs.writeFileSync(resultsPath, [header, ...rows].join("\n") + "\n", "utf8");

  const ok = results.filter((r) => r.status === "ok").length;
  const failed = results.length - ok;
  console.log(`\nDone: ${ok} succeeded, ${failed} failed → results written to scripts/results.csv`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
