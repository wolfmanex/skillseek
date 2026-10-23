// Imports Estonian construction firms from the Business Register open data into the Company table.
//
//   npx tsx scripts/import-companies.ts                 download the latest dump and import
//   npx tsx scripts/import-companies.ts --file dump.zip  use a downloaded .json or .json.zip
//   options: --main-only (construction must be the main activity), --dry-run, --limit N
//
// Needs DATABASE_URL (and `unzip` for .zip files). Runs from the "Import companies" GitHub Action.
import { spawn } from "node:child_process";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { PrismaClient } from "@prisma/client";
import {
  ARIREGISTER_GENERAL_JSON_URL,
  JsonArraySplitter,
  parseRegistryCompany,
  type CompanyInput,
} from "../src/lib/company-import";
import { expireStaleInvites, upsertCompanies } from "../src/lib/company-store";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

async function download(url: string) {
  const dir = await mkdtemp(path.join(tmpdir(), "ariregister-"));
  const file = path.join(dir, path.basename(new URL(url).pathname));
  console.log(`Downloading ${url}`);
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Download failed: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body as import("node:stream/web").ReadableStream), createWriteStream(file));
  return file;
}

function openText(file: string): Readable {
  if (!file.endsWith(".zip")) return createReadStream(file);
  const unzip = spawn("unzip", ["-p", file], { stdio: ["ignore", "pipe", "inherit"] });
  return unzip.stdout;
}

async function main() {
  const file = option("file") ?? (await download(option("url") ?? ARIREGISTER_GENERAL_JSON_URL));
  const limit = Number(option("limit") ?? Infinity);
  const mainOnly = flag("main-only");

  const splitter = new JsonArraySplitter();
  const found: CompanyInput[] = [];
  let seen = 0;
  const stream = openText(file);
  stream.setEncoding("utf8");
  for await (const chunk of stream) {
    for (const record of splitter.push(chunk as string)) {
      seen++;
      const company = parseRegistryCompany(record, { mainOnly });
      if (company) found.push(company);
    }
    if (found.length >= limit) {
      stream.destroy();
      break;
    }
  }
  const companies = found.slice(0, limit);
  const withEmail = companies.filter((c) => c.email).length;
  console.log(`Read ${seen} register records, ${companies.length} construction firms (${withEmail} with an email)`);

  if (flag("dry-run")) {
    console.log(JSON.stringify(companies.slice(0, 5), null, 2));
    return;
  }
  const db = new PrismaClient();
  try {
    const written = await upsertCompanies(db, companies);
    const expired = await expireStaleInvites(db);
    console.log(`Wrote ${written} companies; wiped ${expired} unclaimed invitations older than a year`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
