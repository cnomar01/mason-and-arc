"use client";

import Link from "next/link";
import Reveal from "../animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";

const content = {
  en: {
    line1: "One idea.",
    line2: "Many expressions.",
    intro: "Space, identity, image and digital experience — brought together by one clear point of view.",
    link: "Explore the studio",
  },
  ar: {
    line1: "فكرة واحدة.",
    line2: "تعبيرات متعددة.",
    intro: "المكان والهوية والصورة والتجربة الرقمية، كلها تتكامل حول رؤية تصميمية واحدة.",
    link: "اكتشف الاستوديو",
  },
  it: {
    line1: "Un’idea.",
    line2: "Molte espressioni.",
    intro: "Spazi, identità, immagini ed esperienze digitali, uniti da una visione chiara.",
    link: "Scopri lo studio",
  },
} as const;

export default function Manifesto() {
  const { locale, copy } = useLocale();
  const text = content[locale];

  return (
    <section className="bg-[#f8f7f4] px-6 py-24 text-neutral-900 sm:px-8 md:px-10 md:py-32 lg:px-16">
      <div className="grid gap-9 border-t border-neutral-300 pt-7 lg:grid-cols-[.35fr_1.65fr] lg:gap-12">
        <p className="text-[9px] uppercase tracking-[.3em] text-neutral-500">
          {copy.philosophyLabel}
        </p>

        <div>
          <Reveal>
            <h2 className="max-w-5xl text-[clamp(3rem,7vw,7rem)] font-light leading-[.98] tracking-[-.05em]">
              <span className="block">{text.line1}</span>
              <span className="block">{text.line2}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-xl text-sm font-light leading-7 text-neutral-600 md:mt-10 md:text-base md:leading-8">
              {text.intro}
            </p>
            <Link href="/about" className="mt-8 inline-flex items-center gap-4 border-b border-neutral-400 pb-2 text-[10px] uppercase tracking-[.18em] transition-opacity hover:opacity-50">
              {text.link} <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
