import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession("admin");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("legacy_submissions")
    .update({
      status: "approved_scheduled",
      reviewed_at: new Date().toISOString(),
      reviewed_by: "admin",
    })
    .eq("id", id)
    .eq("status", "submitted");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/legacy-review", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}