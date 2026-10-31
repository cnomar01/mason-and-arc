"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, MessageSquare, RefreshCw, Activity } from "lucide-react";
import { listResource } from "@/lib/client/dataApi";

type FileRow = { id: string; name: string; revision: string; issue_date?: string | null };
type ApprovalRow = { id: string; title: string; status: string; reviewed_at?: string | null };
type MessageRow = { id: string; sender_name: string; body: string; created_at: string };
type UpdateRow = { id: string; title: string; summary: string; published_at?: string | null };
type Entry = { id: string; label: string; detail: string; date: string | null; kind: "file" | "approval" | "message" | "update" };

function formatDate(date: string | null) {
  if (!date) return "Date not specified";
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? "Date not specified" : value.toLocaleDateString();
}

export default function ClientActivityPage() {
  const params = useParams<{ id: string }>();
  const projectId = params?.id || "";
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try {
      const [files, approvals, messages, updates] = await Promise.all([
        listResource<FileRow>("files", projectId, 500),
        listResource<ApprovalRow>("approvals", projectId, 500),
        listResource<MessageRow>("messages", projectId, 500),
        listResource<UpdateRow>("project_updates", projectId, 500),
      ]);
      const next: Entry[] = [
        ...files.data.map((file) => ({
          id: "file-" + file.id, label: "File issued",
          detail: file.name + (file.revision ? " · Rev. " + file.revision : ""),
          date: file.issue_date || null, kind: "file" as const,
        })),
        ...approvals.data.map((approval) => ({
          id: "approval-" + approval.id,
          label: "Approval · " + approval.status,
          detail: approval.title, date: approval.reviewed_at || null,
          kind: "approval" as const,
        })),
        ...messages.data.map((message) => ({
          id: "message-" + message.id, label: "Project message",
          detail: message.sender_name + ": " + message.body,
          date: message.created_at || null, kind: "message" as const,
        })),
        ...updates.data.map((update) => ({
          id: "update-" + update.id, label: update.title,
          detail: update.summary, date: update.published_at || null,
          kind: "update" as const,
        })),
      ];
      next.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setEntries(next.slice(0, 100));
    } catch (cause) {
      setEntries([]);
      setError(cause instanceof Error ? cause.message : "Could not load the project activity.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { void reload(); }, [reload]);
  const eventCount = useMemo(() => entries.length, [entries]);

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <Link href={"/app/projects/" + projectId} className="inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/55 hover:text-white">
          <ArrowLeft size={15} /> Project
        </Link>
        <header className="mt-14 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Client Activity</p>
            <h1 className="mt-4 text-5xl font-light tracking-[-0.05em]">Project timeline</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">
              Only real project updates, approved file issues, messages and review decisions are shown.
            </p>
          </div>
          <button type="button" onClick={() => void reload()} className="inline-flex min-h-11 items-center gap-2 border-b border-white/40 text-xs text-white/70 hover:text-white">
            <RefreshCw size={15} /> Refresh
          </button>
        </header>
        {error && <p role="alert" className="mt-8 border border-red-400/30 p-4 text-sm text-red-200">{error}</p>}
        <div className="mt-12 space-y-3">
          {loading ? <p className="py-10 text-sm text-white/55">Loading activity…</p> : eventCount ? (
            entries.map((entry) => {
              const Icon = entry.kind === "file" ? FileText : entry.kind === "approval" ? CheckCircle2 : entry.kind === "message" ? MessageSquare : Activity;
              return (
                <article key={entry.id} className="flex gap-5 border border-white/15 bg-white/[0.02] p-5 md:p-6">
                  <Icon size={16} className="mt-1 shrink-0 text-white/50" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="text-sm font-medium text-white/80">{entry.label}</h2>
                      <time className="text-[10px] uppercase tracking-[0.12em] text-white/45">{formatDate(entry.date)}</time>
                    </div>
                    <p className="mt-2 break-words whitespace-pre-wrap text-xs leading-6 text-white/55">{entry.detail}</p>
                  </div>
                </article>
              );
            })
          ) : !error ? (
            <p className="border border-white/15 p-8 text-sm text-white/55">No client-visible activity is available yet.</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
