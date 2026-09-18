import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getGraduationDate, parseReleaseDateInput, type GraduationTerm } from "@/lib/legacy";
import { requireSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

async function hasValidFileSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true;
  // WEBP: "RIFF"....."WEBP"
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return true;
  // PDF: %PDF
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return true;
  return false;
}

export async function POST(request: Request) {
  const session = await requireSession("active");
  if (!session) {
    return NextResponse.json({ error: "You must be signed in as an active member to submit a memory." }, { status: 401 });
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? request.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(`legacy-submit:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions. Please wait a while and try again." }, { status: 429 });
  }
  if (!checkRateLimit(`legacy-submit-email:${session.email.toLowerCase()}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions for this account. Please wait a while and try again." }, { status: 429 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const formData = await request.formData();

    const getString = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : "";
    };

    const getNumber = (key: string) => {
      const value = formData.get(key);
      if (typeof value !== "string") return 0;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const firstName = getString("firstName");
    const lastName = getString("lastName");
    const graduationYear = getNumber("graduationYear");
    const title = getString("title");
    const memoryBody = getString("memoryBody");
    const mediaType = getString("mediaType") || "memory";
    const requestedReleaseDate = getString("releaseDate");
    const consentToPublish = getString("consentToPublish") === "true";

    if (
      !firstName ||
      !lastName ||
      !graduationYear ||
      !title ||
      !memoryBody ||
      !requestedReleaseDate ||
      !consentToPublish
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const releaseAt = parseReleaseDateInput(requestedReleaseDate);
    if (!releaseAt) {
      return NextResponse.json(
        { error: "Please choose a valid release date." },
        { status: 400 }
      );
    }

    const today = new Date();
    const startOfTodayUtc = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0
    );

    if (releaseAt.getTime() < startOfTodayUtc) {
      return NextResponse.json(
        { error: "Release date must be today or later." },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
    const normalizedSessionEmail = session.email.toLowerCase().trim();

    // Identity is anchored to the authenticated session's email, not to the
    // client-submitted name/year, so a signed-in member can only submit under
    // their own linked alumni record.
    const { data: privateDetails, error: privateError } = await supabase
      .from("alumni_private_details")
      .select("alumni_profile_id, email, alumni_profiles(id, full_name, graduation_year, graduation_term, member_status, alumni_access_enabled)")
      .eq("email", normalizedSessionEmail)
      .maybeSingle();

    if (privateError) {
      return NextResponse.json({ error: privateError.message }, { status: 500 });
    }

    if (!privateDetails) {
      return NextResponse.json(
        { error: "Your private record could not be found." },
        { status: 403 }
      );
    }

    if (!privateDetails.email) {
      return NextResponse.json(
        { error: "We could not find an email on file for this record. Please ask an officer to update your member email first." },
        { status: 400 }
      );
    }

    const profile = Array.isArray((privateDetails as any).alumni_profiles)
      ? (privateDetails as any).alumni_profiles[0]
      : (privateDetails as any).alumni_profiles;

    if (!profile) {
      return NextResponse.json(
        { error: "We could not find a matching member/alumni record." },
        { status: 403 }
      );
    }

    if (profile.full_name !== fullName || Number(profile.graduation_year) !== graduationYear) {
      return NextResponse.json(
        { error: "Your name or graduation year did not match the record linked to your account." },
        { status: 403 }
      );
    }

    const allowedStatuses = ["active", "graduating", "alumni"];
    const hasAllowedStatus = allowedStatuses.includes(profile.member_status);

    if (!hasAllowedStatus && !profile.alumni_access_enabled) {
      return NextResponse.json(
        { error: "This record is not currently eligible to submit archive memories." },
        { status: 403 }
      );
    }

    const graduationTerm = (profile.graduation_term || "spring") as GraduationTerm;
    const resolvedGraduationYear = profile.graduation_year;

    if (!resolvedGraduationYear) {
      return NextResponse.json(
        { error: "This record is missing graduation information." },
        { status: 400 }
      );
    }

    const graduationDate = getGraduationDate(resolvedGraduationYear, graduationTerm);

    const fileValue = formData.get("file");
    const file =
      fileValue &&
      typeof fileValue === "object" &&
      "arrayBuffer" in fileValue &&
      "size" in fileValue
        ? (fileValue as File)
        : null;

    let storageBucket: string | null = null;
    let storagePath: string | null = null;
    let fileUrl: string | null = null;

    if (file && file.size > 0) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Only JPG, PNG, WEBP, and PDF files are allowed." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "File is too large. Maximum size is 10 MB." },
          { status: 400 }
        );
      }

      if (!(await hasValidFileSignature(file))) {
        return NextResponse.json(
          { error: "This file does not appear to be a valid JPG, PNG, WEBP, or PDF file." },
          { status: 400 }
        );
      }

      storageBucket = "legacy-submissions";

      const extension = file.name.includes(".")
        ? file.name.split(".").pop()?.toLowerCase()
        : "bin";

      const safeExtension = extension || "bin";
      const uniquePath = `${profile.id}/${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;

      const bytes = Buffer.from(await file.arrayBuffer());

      const upload = await supabase.storage.from(storageBucket).upload(uniquePath, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

      if (upload.error) {
        return NextResponse.json({ error: upload.error.message }, { status: 500 });
      }

      storagePath = uniquePath;
    }

    const { error } = await supabase.from("legacy_submissions").insert({
      submitted_by_profile_id: profile.id,
      submitted_by_user_id: null,
      member_status_at_submission: profile.member_status,
      full_name: profile.full_name,
      email: privateDetails.email,
      graduation_year: resolvedGraduationYear,
      graduation_term: graduationTerm,
      graduation_date: graduationDate.toISOString().slice(0, 10),
      title,
      memory_body: memoryBody,
      media_type: mediaType,
      storage_bucket: storageBucket,
      storage_path: storagePath,
      file_url: fileUrl,
      consent_to_publish: consentToPublish,
      status: "submitted",
      release_at: releaseAt.toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Submission failed." },
      { status: 500 }
    );
  }
}
