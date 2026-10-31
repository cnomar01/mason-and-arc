import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { fetchAuthorizedProjectDriveFile } from "@/lib/server/googleDrive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireServerUser(["Client"]);
    if (!user.clientId) throw new Error("FORBIDDEN");
    const { id } = await context.params;
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(id))
      return NextResponse.json({ error: "Invalid file ID." }, { status: 400 });

    // Allow only an approved, current and explicitly client-visible record
    // belonging to the signed-in client's own project.
    const result = await query<{
      project_id: string; storage_key: string | null; file_name: string | null;
      name: string; file_type: string | null;
    }>(
      "SELECT f.project_id,f.storage_key,f.file_name,f.name,f.file_type " +
      "FROM project_files f JOIN projects p ON p.id=f.project_id " +
      "WHERE f.id=$1 AND p.client_id=$2 AND f.visibility='Client' " +
      "AND f.status='Approved' AND f.is_current=true LIMIT 1",
      [id, user.clientId]
    );
    const file = result.rows[0];
    if (!file?.storage_key?.startsWith("drive:"))
      return NextResponse.json({ error: "No downloadable file is available." }, { status: 404 });
    const driveId = file.storage_key.slice("drive:".length);
    const upstream = await fetchAuthorizedProjectDriveFile(driveId, file.project_id);
    const name = (file.file_name || file.name || "project-file")
      .replace(/[\r\n"\\\/\x00-\x1f]/g, "_").slice(0, 160);

    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") || file.file_type || "application/octet-stream",
        "Content-Disposition": 'attachment; filename="' + name + '"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHENTICATED")
      return NextResponse.json({ error: "Sign in to download files." }, { status: 401 });
    if (message === "FORBIDDEN")
      return NextResponse.json({ error: "File access denied." }, { status: 403 });
    console.error("Client file download failed", error);
    return NextResponse.json({ error: "Could not access this project file." }, { status: 500 });
  }
}
