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
    <section className="bg-[#4F6B7A] px-6 pb-28 pt-24 text-white sm:px-8 md:px-10 md:pb-36 md:pt-32 lg:px-16">
      <div className="grid gap-10 border-t border-white/35 pt-7 lg:grid-cols-[.35fr_1.65fr] lg:gap-12">
        <p className="text-[9px] uppercase tracking-[.3em] text-white/80">
          {copy.label}
        </p>
        <div>
          <Reveal>
            <h2 className="max-w-5xl text-[clamp(3.75rem,9vw,9rem)] font-light leading-[.93] tracking-[-.055em]">
              {copy.title}
            </h2>
          </Reveal>
          <p className="mt-9 max-w-lg text-base font-light leading-8 text-white/85">
            {copy.intro}
          </p>
          <Link href="/contact" className="mt-9 inline-flex min-h-11 items-center gap-5 border-b border-white/70 pb-2 text-[10px] uppercase tracking-[.18em] text-white transition-opacity duration-300 hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            {copy.action} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
