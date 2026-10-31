"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, RefreshCw } from "lucide-react";
import { listResource } from "@/lib/client/dataApi";

type Approval = {
  id: string;
  project_id: string;
  title: string;
  type: string;
  revision: string | null;
  description: string;
  status: string;
  review_comment?: string | null;
  reviewed_at?: string | null;
};

const pendingStates = new Set(["pending", "pending approval", "awaiting approval"]);
const isPending = (status: string) => pendingStates.has(status.trim().toLowerCase());

export default function ClientApprovalsPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id || "";
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const reload = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try {
      const result = await listResource<Approval>("approvals", projectId, 500);
      setApprovals(result.data);
    } catch (cause) {
      setApprovals([]);
      setError(cause instanceof Error ? cause.message : "Could not load approvals.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { void reload(); }, [reload]);

  const pendingCount = useMemo(
    () => approvals.filter((item) => isPending(item.status)).length,
    [approvals]
  );

  async function submitDecision(approvalId: string, status: "Approved" | "Changes Requested") {
    setReviewError("");
    if (status === "Changes Requested" && !comment.trim()) {
      setReviewError("Please explain what needs to change.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(
        "/api/client/approvals/" + encodeURIComponent(approvalId),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status, comment: comment.trim() }),
        }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not record the decision.");
      setApprovals((items) => items.map((item) =>
        item.id === approvalId
          ? { ...item, status: result.data.status, review_comment: result.data.review_comment, reviewed_at: result.data.reviewed_at }
          : item
      ));
      setReviewId(null);
      setComment("");
    } catch (cause) {
      setReviewError(cause instanceof Error ? cause.message : "Could not save the review.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <header className="flex items-center justify-between px-6 py-6 md:px-10">
        <Link href={"/app/projects/" + projectId} className="text-xs uppercase tracking-[0.18em] text-white/55 hover:text-white">
          ← Project
        </Link>
        <Link href="/app" aria-label="Client portal">
          <img src="/images/logo-mason-arc.png" alt="Mason & Arc" className="h-8 w-auto object-contain" />
        </Link>
      </header>
      <section className="px-6 pb-32 pt-16 md:px-10 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Client Review</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <h1 className="text-5xl font-light tracking-[-0.05em] md:text-7xl">Approvals</h1>
            <button type="button" onClick={() => void reload()} aria-label="Refresh approvals" className="inline-flex min-h-11 items-center gap-2 border-b border-white/35 text-xs text-white/70 hover:text-white">
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/50">
            Review actual submissions for this project. Decisions are recorded and shared with the studio.
          </p>
          {!loading && !error && approvals.length > 0 && (
            <p className="mt-8 inline-flex items-center gap-2 text-xs text-white/65">
              {pendingCount ? <Clock3 size={15} /> : <CheckCircle2 size={15} />}
              {pendingCount} awaiting your decision
            </p>
          )}
          {error && <p role="alert" className="mt-7 rounded-lg border border-red-400/30 p-4 text-sm text-red-200">{error}</p>}
          <div className="mt-12 space-y-3">
            {loading ? <p className="py-12 text-sm text-white/50">Loading approvals…</p> : approvals.length ? (
              approvals.map((item, index) => {
                const open = reviewId === item.id;
                const pending = isPending(item.status);
                return (
                  <article key={item.id} className="border border-white/15 p-6 md:p-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                      <div className="flex min-w-0 gap-5">
                        <span className="text-xs tabular-nums text-white/35">{String(index + 1).padStart(2, "0")}</span>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-white/45">
                            {item.type}{item.revision ? " · Rev. " + item.revision : ""}
                          </p>
                          <h2 className="mt-3 text-xl font-light">{item.title}</h2>
                          {item.description && <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6 text-white/55">{item.description}</p>}
                          {item.review_comment && !pending && <p className="mt-3 text-sm leading-6 text-white/65">Review note: {item.review_comment}</p>}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <span className="text-[10px] uppercase tracking-[0.12em] text-white/60">{item.status}</span>
                        {pending && <button
                          type="button"
                          onClick={() => { setReviewId(open ? null : item.id); setComment(""); setReviewError(""); }}
                          aria-expanded={open}
                          className="min-h-11 border-b border-white/50 px-1 text-xs uppercase tracking-[0.12em] text-white/90 hover:text-white"
                        >{open ? "Close" : "Review"}</button>}
                      </div>
                    </div>
                    {open && pending && (
                      <div className="mt-8 space-y-4 border-t border-white/15 pt-6">
                        <label className="block text-xs text-white/70">
                          Review comment (required when requesting changes)
                          <textarea
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                            maxLength={2000}
                            rows={3}
                            className="mt-3 w-full resize-y border border-white/25 bg-white/[0.04] p-4 text-sm text-white outline-none focus:border-white/60"
                            placeholder="Describe any changes or conditions…"
                          />
                        </label>
                        {reviewError && <p role="alert" className="text-sm text-red-200">{reviewError}</p>}
                        <div className="flex flex-wrap gap-3">
                          <button disabled={saving} type="button" onClick={() => void submitDecision(item.id, "Approved")} className="min-h-11 bg-white px-5 text-xs font-medium text-black disabled:opacity-50">
                            {saving ? "Saving…" : "Approve"}
                          </button>
                          <button disabled={saving || !comment.trim()} type="button" onClick={() => void submitDecision(item.id, "Changes Requested")} className="min-h-11 border border-white/35 px-5 text-xs text-white disabled:opacity-40">
                            Request changes
                          </button>
                        </div>
                        <p className="text-xs leading-5 text-white/45">The decision is recorded against this specific submission. It cannot be changed here after confirmation.</p>
                      </div>
                    )}
                  </article>
                );
              })
            ) : !error ? (
              <p className="py-12 text-sm text-white/55">There are no approval requests for this project yet.</p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
