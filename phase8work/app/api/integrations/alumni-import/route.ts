import crypto from "crypto";
import { NextResponse } from "next/server";
import { importAdminAlumni } from "@/lib/actions/admin-persist";
import { normalizeAlumniImportRecord, type RawAlumniRecord } from "@/lib/imports/alumni";
import { checkRateLimit, getClientIp } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";

function timingSafeStringEqual(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    // Still run a comparison of equal-length buffers so the response time
    // doesn't leak the expected secret's length either.
    crypto.timingSafeEqual(bufferA, bufferA);
    return false;
  }
  return crypto.timingSafeEqual(bufferA, bufferB);
}

function isAuthorized(request: Request) {
  const secret = process.env.FORM_IMPORT_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization") || "";
  const importSecret = request.headers.get("x-import-secret") || "";

  return timingSafeStringEqual(authHeader, `Bearer ${secret}`) || timingSafeStringEqual(importSecret, secret);
}

function getRecords(payload: unknown): RawAlumniRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is RawAlumniRecord => Boolean(item) && typeof item === "object");
  }

  if (payload && typeof payload === "object") {
    const candidate = payload as { records?: unknown; row?: unknown };

    if (Array.isArray(candidate.records)) {
      return candidate.records.filter((item): item is RawAlumniRecord => Boolean(item) && typeof item === "object");
    }

    if (candidate.row && typeof candidate.row === "object") {
      return [candidate.row as RawAlumniRecord];
    }

    return [payload as RawAlumniRecord];
  }

  return [];
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`alumni-import:${ip}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a while and try again." }, { status: 429 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const records = getRecords(payload);

  if (!records.length) {
    return NextResponse.json({ error: "No import rows were provided." }, { status: 400 });
  }

  const normalized = [];

  for (const record of records) {
    const parsed = normalizeAlumniImportRecord(record);

    if (!parsed.data) {
      return NextResponse.json({ error: parsed.error || "Invalid import row." }, { status: 400 });
    }

    normalized.push(parsed.data);
  }

  const result = await importAdminAlumni(normalized);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    importedCount: result.count ?? normalized.length,
  });
}
