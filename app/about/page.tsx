"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const content = {
  en: {
    eyebrow: "About the studio",
    hero1: "One vision.",
    hero2: "Many disciplines.",
    intro: "Mason & Arc is an independent, multidisciplinary design studio working across architecture, interiors, identity, visualization and digital experiences.",
    storyLabel: "Our story",
    storyTitle: "An Italian origin. A new chapter.",
    story: "Our roots in Italy inform the care we bring to proportion, material, craft and detail. The current Mason & Arc chapter began in 2024, bringing these values into a connected design practice based in Egypt.",
    timeline: [
      ["2001", "Origins in Italy"],
      ["2024", "Mason & Arc, a new chapter"],
      ["2025", "Egypt"],
      ["2026", "Design + Execution"],
    ],
    approachLabel: "Our point of view",
    approachTitle: "One idea, carried through.",
    approach: "We connect the space, the identity and the way a project is communicated, so every decision belongs to the same vision. We believe the strongest work feels considered, coherent and built with intent.",
    ctaLabel: "Start a conversation",
    ctaTitle: "Let's create.",
    ctaLink: "Get in touch",
  },
  ar: {
    eyebrow: "عن الاستوديو",
    hero1: "رؤية واحدة.",
    hero2: "وتخصصات متعددة.",
    intro: "Mason & Arc استوديو تصميم مستقل ومتعدد التخصصات، نعمل في العمارة والتصميم الداخلي والهوية والتصور المعماري والتجارب الرقمية.",
    storyLabel: "قصتنا",
    storyTitle: "جذور إيطالية. وفصل جديد.",
    story: "تعود جذورنا إلى إيطاليا، ومنها جاءت عنايتنا بالنسب والخامات والحرفة والتفاصيل. بدأ الفصل الحالي من Mason & Arc عام ٢٠٢٤، ليجمع هذه القيم في ممارسة تصميمية متكاملة مقرها مصر.",
    timeline: [
      ["٢٠٠١", "الجذور في إيطاليا"],
      ["٢٠٢٤", "Mason & Arc، فصل جديد"],
      ["٢٠٢٥", "مصر"],
      ["٢٠٢٦", "التصميم والتنفيذ"],
    ],
    approachLabel: "وجهة نظرنا",
    approachTitle: "فكرة واحدة، تمتد إلى كل تفصيلة.",
    approach: "نربط المكان بالهوية وطريقة تقديم المشروع، ليكون كل قرار جزءًا من رؤية واحدة. نؤمن أن أفضل الأعمال هي التي تتميز بالوضوح والاتساق والعناية بالتنفيذ.",
    ctaLabel: "لنبدأ الحوار",
    ctaTitle: "لنصنع شيئًا معًا.",
    ctaLink: "تواصل معنا",
  },
  it: {
    eyebrow: "Lo studio",
    hero1: "Una visione.",
    hero2: "Molte discipline.",
    intro: "Mason & Arc è uno studio di design multidisciplinare indipendente, attivo in architettura, interni, identità, visualizzazione ed esperienze digitali.",
    storyLabel: "La nostra storia",
    storyTitle: "Origini italiane. Un nuovo capitolo.",
    story: "Le nostre radici italiane guidano l’attenzione a proporzioni, materiali, artigianalità e dettagli. Il capitolo attuale di Mason & Arc è iniziato nel 2024 e unisce questi valori in una pratica di design con sede in Egitto.",
    timeline: [
      ["2001", "Origini in Italia"],
      ["2024", "Mason & Arc, un nuovo capitolo"],
      ["2025", "Egitto"],
      ["2026", "Progettazione + Realizzazione"],
    ],
    approachLabel: "Il nostro punto di vista",
    approachTitle: "Un’idea, portata fino in fondo.",
    approach: "Connettiamo spazio, identità e comunicazione affinché ogni decisione appartenga alla stessa visione. Crediamo in un lavoro curato, coerente e realizzato con intenzione.",
    ctaLabel: "Iniziamo a parlare",
    ctaTitle: "Creiamo insieme.",
    ctaLink: "Contattaci",
  },
} as const;

export default function AboutPage() {
  const { locale } = useLocale();
  const copy = content[locale];

  return (
    <main className="bg-[#f8f7f4] text-neutral-900">
      <section className="px-6 pb-24 pt-36 sm:px-8 md:px-10 md:pb-36 md:pt-44 lg:px-16">
        <div className="grid gap-10 border-t border-neutral-300 pt-7 lg:grid-cols-[.35fr_1.65fr]">
          <p className="text-[9px] uppercase tracking-[.3em] text-neutral-500">{copy.eyebrow}</p>
          <div>
            <h1 className="max-w-6xl text-[clamp(3.8rem,9vw,9rem)] font-light leading-[.91] tracking-[-.055em]">
              <span className="block">{copy.hero1}</span>
              <span className="block">{copy.hero2}</span>
            </h1>
            <p className="mt-12 max-w-2xl text-base font-light leading-8 text-neutral-600 md:mt-16 md:text-lg">
              {copy.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 md:px-10 md:py-28 lg:px-16">
        <div className="grid gap-10 border-t border-neutral-300 pt-7 lg:grid-cols-[.35fr_1.65fr]">
          <p className="text-[9px] uppercase tracking-[.3em] text-neutral-500">{copy.storyLabel}</p>
          <div>
            <h2 className="max-w-5xl text-[clamp(2.8rem,6vw,6rem)] font-light leading-[.96] tracking-[-.05em]">
              {copy.storyTitle}
            </h2>
            <p className="mt-9 max-w-2xl text-base font-light leading-8 text-neutral-600">{copy.story}</p>
            <div className="mt-14 grid gap-0 border-t border-neutral-300 md:mt-20">
              {copy.timeline.map(([year, label]) => (
                <div key={year} className="grid grid-cols-[100px_1fr] gap-6 border-b border-neutral-300 py-6 md:grid-cols-[150px_1fr] md:py-8">
                  <span className="text-xl font-light tracking-[-.03em] text-[#4F6B7A] md:text-2xl">{year}</span>
                  <span className="self-center text-lg font-light text-neutral-800 md:text-2xl">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 md:px-10 md:py-28 lg:px-16">
        <div className="grid gap-10 border-t border-neutral-300 pt-7 lg:grid-cols-[.35fr_1.65fr]">
          <p className="text-[9px] uppercase tracking-[.3em] text-neutral-500">{copy.approachLabel}</p>
          <div>
            <h2 className="max-w-5xl text-[clamp(2.8rem,6vw,6rem)] font-light leading-[.96] tracking-[-.05em]">
              {copy.approachTitle}
            </h2>
            <p className="mt-9 max-w-2xl text-base font-light leading-8 text-neutral-600">{copy.approach}</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28 pt-16 sm:px-8 md:px-10 md:pb-36 lg:px-16">
        <div className="grid gap-10 border-t border-neutral-300 pt-7 lg:grid-cols-[.35fr_1.65fr]">
          <p className="text-[9px] uppercase tracking-[.3em] text-neutral-500">{copy.ctaLabel}</p>
          <div>
            <h2 className="text-[clamp(3.75rem,9vw,9rem)] font-light leading-[.93] tracking-[-.055em]">
              {copy.ctaTitle}
            </h2>
            <Link href="/contact" className="mt-10 inline-flex items-center gap-5 border-b border-neutral-500 pb-2 text-[10px] uppercase tracking-[.18em] transition-opacity hover:opacity-50">
              {copy.ctaLink} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
