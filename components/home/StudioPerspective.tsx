"use client";

import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";

const content = {
  en: {
    label: "Start a conversation",
    title: "Let's create.",
    intro: "A new place, identity, or experience starts with a conversation.",
    action: "Start a project",
  },
  ar: {
    label: "لنبدأ الحوار",
    title: "لنصنع شيئًا معًا.",
    intro: "كل مشروع أو هوية أو تجربة جديدة تبدأ بحوار.",
    action: "ابدأ مشروعك",
  },
  it: {
    label: "Iniziamo a parlare",
    title: "Creiamo insieme.",
    intro: "Un nuovo spazio, un’identità o un’esperienza inizia da una conversazione.",
    action: "Inizia un progetto",
  },
} as const;

export default function StudioPerspective() {
  const { locale } = useLocale();
  const copy = content[locale];

  return (
    <section className="bg-[#f8f7f4] px-6 pb-28 pt-10 text-neutral-900 sm:px-8 md:px-10 md:pb-36 md:pt-16 lg:px-16">
      <div className="grid gap-10 border-t border-neutral-300 pt-7 lg:grid-cols-[.35fr_1.65fr] lg:gap-12">
        <p className="text-[9px] uppercase tracking-[.3em] text-neutral-500">
          {copy.label}
        </p>
        <div>
          <Reveal>
            <h2 className="max-w-5xl text-[clamp(3.75rem,9vw,9rem)] font-light leading-[.93] tracking-[-.055em]">
              {copy.title}
            </h2>
          </Reveal>
          <p className="mt-9 max-w-lg text-base font-light leading-8 text-neutral-600">
            {copy.intro}
          </p>
          <Link href="/contact" className="mt-9 inline-flex items-center gap-5 border-b border-neutral-400 pb-2 text-[10px] uppercase tracking-[.18em] transition-opacity hover:opacity-50">
            {copy.action} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
