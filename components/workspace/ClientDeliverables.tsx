"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, FileText, RefreshCw } from "lucide-react";
import { listResource } from "@/lib/client/dataApi";

type ClientFile = {
  id: string;
  name: string;
  category: string;
  revision: string;
  document_number?: string | null;
  issue_date?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  storage_key?: string | null;
  is_current?: boolean;
  status: string;
};

type View = "renders" | "documents";

const visualCategories = new Set([
  "render", "visualization", "animation", "film", "video",
]);

const drawingCategories = new Set([
  "architectural drawing", "civil drawing", "site photo", "model",
]);

function belongsToView(file: ClientFile, view: View) {
  const category = file.category.toLowerCase().trim();
  const visual = visualCategories.has(category);
  return view === "renders"
    ? visual
    : !visual && !drawingCategories.has(category);
}

function readableSize(size?: number | null) {
  if (!size || size <= 0) return null;
  if (size < 1024 * 1024) return String(Math.ceil(size / 1024)) + " KB";
  return (size / (1024 * 1024)).toFixed(1) + " MB";
}

export default function ClientDeliverables({ view }: { view: View }) {
  const params = useParams<{ id: string }>();
  const projectId = params?.id || "";
  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try {
      const response = await listResource<ClientFile>("files", projectId, 500);
      setFiles(response.data);
    } catch (cause) {
      setFiles([]);
      setError(cause instanceof Error ? cause.message : "Could not load project files.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { void reload(); }, [reload]);

  // The server also scopes files to the signed-in client's project and the
  // client-visible flag. The presentation adds an approved/current filter.
  const issued = useMemo(() => files
    .filter((file) => file.status.toLowerCase() === "approved" && file.is_current !== false)
    .filter((file) => belongsToView(file, view)), [files, view]);

  const isRender = view === "renders";
  const title = isRender ? "Renders & visualization" : "Documents & deliverables";
  const empty = isRender
    ? "No approved visualizations have been issued for this project yet."
    : "No approved documents have been issued for this project yet.";

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <header className="flex items-center justify-between px-6 py-6 md:px-10">
        <Link
          href={"/app/projects/" + projectId}
          className="text-xs uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
        >
          ← Project
        </Link>
        <Link href="/app" aria-label="Client portal">
          <img src="/images/logo-mason-arc.png" alt="Mason & Arc" className="h-8 w-auto object-contain" />
        </Link>
      </header>

      <section className="px-6 pb-32 pt-16 md:px-10 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Project Resources</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <h1 className="text-4xl font-light tracking-[-0.05em] sm:text-5xl md:text-7xl">{title}</h1>
            <button
              type="button"
              onClick={() => void reload()}
              aria-label="Refresh project files"
              className="inline-flex min-h-11 items-center gap-2 border-b border-white/35 text-xs text-white/70 hover:text-white"
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/50">
            Only approved, current items shared by the studio appear here. Every item belongs to this project.
          </p>
          {error && <p role="alert" className="mt-8 rounded-lg border border-red-400/30 p-4 text-sm text-red-200">{error}</p>}
          <div className={isRender ? "mt-14 grid gap-4 md:grid-cols-2" : "mt-14 overflow-hidden border-y border-white/15"}>
            {loading ? (
              <p className="py-12 text-sm text-white/50">Loading project files…</p>
            ) : issued.length ? issued.map((file, index) => (
              <article
                key={file.id}
                className={isRender
                  ? "flex flex-col justify-between gap-8 border border-white/15 bg-white/[0.025] p-6 md:min-h-56 md:p-8"
                  : "flex flex-wrap items-center justify-between gap-4 border-b border-white/10 py-6 last:border-b-0 md:py-8"}
              >
                <div className="flex min-w-0 items-start gap-5">
                  <span className="text-xs tabular-nums text-white/35">{String(index + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    {isRender && <FileText size={19} className="mb-5 text-white/45" aria-hidden="true" />}
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">{file.category}</p>
                    <h2 className="mt-3 break-words text-xl font-light">{file.name}</h2>
                    <p className="mt-3 text-xs leading-5 text-white/45">
                      {file.document_number ? file.document_number + " · " : ""}
                      Rev. {file.revision || "—"}
                      {file.issue_date ? " · " + file.issue_date.slice(0, 10) : ""}
                      {readableSize(file.file_size) ? " · " + readableSize(file.file_size) : ""}
                    </p>
                  </div>
                </div>
                {file.storage_key?.startsWith("drive:") ? (
                  <a
                    href={"/api/client/files/" + encodeURIComponent(file.id) + "/download"}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-white/40 text-xs uppercase tracking-[0.12em] text-white/80 transition hover:text-white"
                  >
                    <Download size={15} aria-hidden="true" /> Download
                  </a>
                ) : (
                  <span className="text-xs text-white/40">File attachment not yet available</span>
                )}
              </article>
            )) : !error ? (
              <p className="py-12 text-sm text-white/55">{empty}</p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
