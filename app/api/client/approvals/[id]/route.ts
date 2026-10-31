import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REVIEW_STATES = new Set(["Approved", "Changes Requested"]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireServerUser(["Client"]);
    if (!user.clientId) {
      return NextResponse.json({ error: "No client account is assigned." }, { status: 403 });
    }

    const { id } = await context.params;
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) {
      return NextResponse.json({ error: "Invalid approval." }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const status = typeof body.status === "string" ? body.status.trim() : "";
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";

    if (!REVIEW_STATES.has(status) || comment.length > 2000) {
      return NextResponse.json({ error: "Invalid review decision or comment." }, { status: 400 });
    }
    if (status === "Changes Requested" && !comment) {
      return NextResponse.json({ error: "Explain the changes requested." }, { status: 400 });
    }

    // Atomic scope + pending-state check. No client can review another client's
    // item or overwrite an already recorded decision.
    const updated = await query<{
      id: string; project_id: string; status: string; review_comment: string;
      reviewed_by_name: string; reviewed_at: string;
    }>(
      "UPDATE approvals a SET status=$1, review_comment=$2, reviewed_by_id=$3, reviewed_by_name=$4, reviewed_at=NOW(), updated_at=NOW() " +
      "WHERE a.id=$5 AND lower(trim(a.status)) IN ('pending','pending approval','awaiting approval') " +
      "AND EXISTS (SELECT 1 FROM projects p WHERE p.id=a.project_id AND p.client_id=$6) " +
      "RETURNING a.id,a.project_id,a.status,a.review_comment,a.reviewed_by_name,a.reviewed_at",
      [status, comment, user.id, user.name, id, user.clientId]
    );

    if (!updated.rows[0]) {
      return NextResponse.json(
        { error: "This approval is unavailable or has already been reviewed." },
        { status: 409 }
      );
    }

    await audit("client.approval.reviewed", "approvals", id, {
      projectId: updated.rows[0].project_id, status,
    }).catch((error) => console.error("Client approval audit failed", error));

    return NextResponse.json(
      { data: updated.rows[0] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Sign in to review approvals." }, { status: 401 });
    if (message === "FORBIDDEN")
      return NextResponse.json({ error: "You cannot review this item." }, { status: 403 });
    console.error("Client approval review failed", error);
    return NextResponse.json({ error: "Could not save the approval decision." }, { status: 500 });
  }
}
