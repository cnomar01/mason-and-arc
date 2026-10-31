"use client";

import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";

const content = {
  en: {
    default: {
      label: "Start a conversation",
      title: "Let's create.",
      intro: "A new place, identity, or experience starts with a conversation.",
      action: "Start a project",
    },
    project: {
      label: "Have a project in mind?",
      title: "Let's create.",
      intro: "",
      action: "Start a conversation",
    },
    back: "Back to all projects",
  },
  ar: {
    default: {
      label: "لنبدأ الحوار",
      title: "لنصنع شيئًا معًا.",
      intro: "كل مشروع أو هوية أو تجربة جديدة تبدأ بحوار.",
      action: "ابدأ مشروعك",
    },
    project: {
      label: "عندك مشروع جديد؟",
      title: "لنصمّم معًا.",
      intro: "",
      action: "ابدأ الحوار",
    },
    back: "العودة إلى المشروعات",
  },
  it: {
    default: {
      label: "Iniziamo a parlare",
      title: "Creiamo insieme.",
      intro: "Un nuovo spazio, un’identità o un’esperienza inizia da una conversazione.",
      action: "Inizia un progetto",
    },
    project: {
      label: "Hai un progetto in mente?",
      title: "Creiamo insieme.",
      intro: "",
      action: "Inizia una conversazione",
    },
    back: "Torna ai progetti",
  },
} as const;

type LetsCreateCTAProps = {
  variant?: "default" | "project";
  href?: string;
  backToProjects?: boolean;
};

export default function LetsCreateCTA({
  variant = "default",
  href = "/contact",
  backToProjects = false,
}: LetsCreateCTAProps) {
  const { locale } = useLocale();
  const copy = content[locale];
  const text = copy[variant];

  return (
    <section
      aria-label={text.title}
      className="bg-[#4F6B7A] px-6 pb-28 pt-24 text-white sm:px-8 md:px-10 md:pb-36 md:pt-32 lg:px-16"
    >
      <div className="grid gap-10 border-t border-white/35 pt-7 lg:grid-cols-[.35fr_1.65fr] lg:gap-12">
        <p className="text-[10px] tracking-[.16em] text-white/85">
          {text.label}
        </p>
        <div>
          <Reveal>
            <h2 className={
              "max-w-5xl font-light " +
              (locale === "ar"
                ? "text-[clamp(3rem,8vw,8rem)] leading-[1.18]"
                : "text-[clamp(3.75rem,9vw,9rem)] leading-[.93] tracking-[-.055em]")
            }>
              {text.title}
            </h2>
          </Reveal>
          {text.intro && (
            <p className="mt-9 max-w-lg text-base font-light leading-8 text-white/85">
              {text.intro}
            </p>
          )}
          <Link
            href={href}
            className="mt-9 inline-flex min-h-11 items-center gap-5 border-b border-white/70 pb-2 text-[10px] uppercase tracking-[.18em] text-white transition-opacity duration-300 hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {text.action} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      {backToProjects && (
        <Link
          href="/projects"
          className="mt-20 inline-flex min-h-11 items-center gap-3 text-[10px] uppercase tracking-[.16em] text-white/80 transition-colors hover:text-white"
        >
          <span aria-hidden="true">←</span> {copy.back}
        </Link>
      )}
    </section>
  );
}
