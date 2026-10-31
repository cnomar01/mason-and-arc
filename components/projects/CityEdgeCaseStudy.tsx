"use client";

import Image from "next/image";
import Link from "next/link";
import { localizedText, localizedYear, projectCopy, useLocale } from "@/components/i18n/LocaleProvider";
import type { WebsiteProject } from "@/lib/server/websiteProjects";

const editorialCopy = {
  en: {
    back: "All projects",
    selected: "Selected work / Architecture",
    overviewLabel: "01 / The project",
    overviewTitle: "Architecture, considered as a whole.",
    type: "Discipline",
    place: "Location",
    period: "Timeline",
    conceptLabel: "02 / The concept",
    conceptTitle: "One coherent architectural language.",
    conceptFallback: "From circulation and program to the expression of the façade.",
    board: "Concept development",
    exteriorCaption: "City Edge — exterior study",
    exteriorAlt: "City Edge exterior perspective",
    openImage: "Open full-size concept board",
    strategyLabel: "Spatial strategy",
    scopeLabel: "03 / The scope",
    scopeTitle: "From concept to detail.",
    supervisionLabel: "Execution supervision",
    extraLabel: "Project imagery",
    closingLabel: "Have a project in mind?",
    closingTitle: "Let's create.",
    closingAction: "Start a conversation",
    returnLabel: "Back to all projects",
  },
  ar: {
    back: "كل المشروعات",
    selected: "أعمال مختارة / العمارة",
    overviewLabel: "٠١ / المشروع",
    overviewTitle: "عمارة تُصمَّم كفكرة متكاملة.",
    type: "التخصص",
    place: "الموقع",
    period: "المدة الزمنية",
    conceptLabel: "٠٢ / الفكرة",
    conceptTitle: "لغة معمارية واحدة.",
    conceptFallback: "من تنظيم الحركة والبرنامج إلى التعبير المعماري للواجهة.",
    board: "تطوير الفكرة التصميمية",
    exteriorCaption: "سيتي إيدج — دراسة الواجهة",
    exteriorAlt: "منظور خارجي لمشروع سيتي إيدج",
    openImage: "افتح لوحة الفكرة بالحجم الكامل",
    strategyLabel: "التنظيم المكاني",
    scopeLabel: "٠٣ / نطاق العمل",
    scopeTitle: "من الفكرة إلى التفاصيل.",
    supervisionLabel: "الإشراف على التنفيذ",
    extraLabel: "صور المشروع",
    closingLabel: "عندك مشروع جديد؟",
    closingTitle: "لنصمّم معًا.",
    closingAction: "ابدأ الحوار",
    returnLabel: "العودة إلى المشروعات",
  },
  it: {
    back: "Tutti i progetti",
    selected: "Lavori selezionati / Architettura",
    overviewLabel: "01 / Il progetto",
    overviewTitle: "Architettura pensata come un insieme.",
    type: "Disciplina",
    place: "Luogo",
    period: "Periodo",
    conceptLabel: "02 / Il concept",
    conceptTitle: "Un linguaggio architettonico coerente.",
    conceptFallback: "Dalla circolazione e dal programma all'espressione della facciata.",
    board: "Sviluppo del concept",
    exteriorCaption: "City Edge — studio dell’esterno",
    exteriorAlt: "Prospettiva esterna di City Edge",
    openImage: "Apri la tavola a grandezza naturale",
    strategyLabel: "Strategia spaziale",
    scopeLabel: "03 / Ambito",
    scopeTitle: "Dall'idea al dettaglio.",
    supervisionLabel: "Supervisione della realizzazione",
    extraLabel: "Immagini del progetto",
    closingLabel: "Hai un progetto in mente?",
    closingTitle: "Creiamo insieme.",
    closingAction: "Inizia una conversazione",
    returnLabel: "Torna ai progetti",
  },
} as const;

export default function CityEdgeCaseStudy({ project }: { project: WebsiteProject }) {
  const { locale } = useLocale();
  const copy = editorialCopy[locale];
  const translated = projectCopy(project, locale);
  const sections = project.content_sections.filter((section) => section.is_visible);
  const concept = sections.find((section) => section.id === "concept");
  const program = sections.find((section) => section.id === "program");
  const scope = sections.find((section) => section.id === "scope");
  const supervision = sections.find((section) => section.id === "execution-supervision");
  const board = concept?.images.find((image) => image.layout === "drawing") || concept?.images[0];
  const conceptBody = concept ? localizedText(concept.body, locale) : "";
  const programBody = program ? localizedText(program.body, locale) : "";
  const supervisionBody = supervision ? localizedText(supervision.body, locale) : "";
  const scopeItems = scope ? localizedText(scope.body, locale).split(/\r?\n/).map((line) => line.trim()).filter(Boolean) : [];
  const designScope = scopeItems.filter((item) => !/supervision|supervisione|الإشراف/i.test(item));
  const gallery = [...new Set(project.gallery)].filter((src) => src && src !== project.image_url && src !== board?.image_url);
  const titleClass = locale === "ar"
    ? "font-[var(--font-arabic)] font-light leading-[1.2] tracking-normal"
    : "font-[var(--font-body)] font-light leading-[.99] tracking-[-.055em]";

  return (
    <main className="min-w-0 overflow-x-clip bg-[#f8f7f4] text-neutral-900">
      <section aria-label={translated.title} className="relative flex h-[100svh] min-h-[590px] flex-col justify-end overflow-hidden bg-[#e9e6e0] text-neutral-950">
        <Image
          src={board?.image_url || project.image_url}
          alt={board ? localizedText(board.alt_text, locale) || copy.board : translated.title}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* A soft paper-coloured scrim keeps the navigation and title legible over the drawings. */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#f8f7f4]/95 via-[#f8f7f4]/5 to-[#f8f7f4]/95" />
        <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-12 pt-32 sm:px-8 md:px-10 md:pb-16 lg:px-16">
          <div className="flex flex-wrap items-start justify-between gap-4 text-[11px] font-medium tracking-[.1em] text-neutral-900">
            <Link href="/projects" className="inline-flex min-h-11 items-center gap-3 underline-offset-4 transition-colors hover:text-[#4F6B7A] hover:underline">
              <span aria-hidden="true">←</span> {copy.back}
            </Link>
            <span className="flex min-h-11 items-center text-end">{copy.selected}</span>
          </div>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <h1 className={(locale === "ar"
              ? "font-[var(--font-arabic)] text-[clamp(3.5rem,9vw,8.6rem)] font-light leading-[1.12]"
              : "font-[var(--font-display)] text-[clamp(4rem,13vw,12rem)] uppercase leading-[.85] tracking-[-.035em]") + " max-w-full break-words"}>
              {translated.title}
            </h1>
            <span className="text-[10px] font-medium tracking-[.16em] text-neutral-700 lg:pb-2">{translated.location}</span>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-20 sm:px-8 md:px-10 md:pb-36 md:pt-28 lg:px-16">
        <div className="grid gap-9 border-t border-neutral-300 pt-7 lg:grid-cols-[.34fr_1.66fr] lg:gap-12">
          <p className="text-[10px] tracking-[.16em] text-neutral-500">{copy.overviewLabel}</p>
          <div>
            <h2 className={titleClass + " max-w-5xl text-[clamp(2.9rem,6vw,6rem)]"}>{copy.overviewTitle}</h2>
            <p className="mt-10 max-w-3xl text-base font-light leading-8 text-neutral-600 md:mt-14 md:text-lg md:leading-9">
              {translated.description}
            </p>
            <dl className="mt-16 grid gap-7 border-t border-neutral-300 pt-6 sm:grid-cols-3 sm:gap-6 md:mt-20">
              {[
                [copy.type, translated.category],
                [copy.place, translated.location],
                [copy.period, localizedYear(project.year, locale)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[9px] uppercase tracking-[.16em] text-neutral-500">{label}</dt>
                  <dd className="mt-3 text-base font-light leading-6">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-[#eeece7] px-6 pb-24 pt-20 text-neutral-900 sm:px-8 md:px-10 md:pb-32 md:pt-28 lg:px-16">
        <div className="grid gap-9 border-t border-neutral-400/50 pt-7 lg:grid-cols-[.34fr_1.66fr] lg:gap-12">
          <p className="text-[10px] tracking-[.16em] text-neutral-500">{copy.conceptLabel}</p>
          <div>
            <h2 className={titleClass + " max-w-5xl text-[clamp(2.9rem,6vw,6rem)]"}>{copy.conceptTitle}</h2>
            <p className="mt-9 max-w-2xl text-base font-light leading-8 text-neutral-600 md:mt-12">
              {conceptBody || copy.conceptFallback}
            </p>
          </div>
        </div>
        <figure className="-mx-6 mt-16 sm:-mx-8 md:-mx-10 md:mt-24 lg:-mx-16">
          <a
            href={project.image_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.exteriorAlt}
            className="group relative block h-[65svh] min-h-[440px] overflow-hidden bg-neutral-300 md:h-[85svh]"
          >
            <Image
              src={project.image_url}
              alt={copy.exteriorAlt}
              fill
              unoptimized
              sizes="100vw"
              className="object-cover object-center transition-transform duration-700 motion-safe:group-hover:scale-[1.015]"
            />
          </a>
          <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 text-[10px] font-normal tracking-[.08em] text-neutral-600 sm:px-8 md:px-10 lg:px-16">
            <span>{copy.exteriorCaption}</span>
            {board && (
              <a
                href={board.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center border-b border-neutral-500/60 transition-colors hover:text-[#4F6B7A]"
              >
                {copy.openImage} ↗
              </a>
            )}
          </figcaption>
        </figure>
        {programBody && (
          <div className="mt-16 grid gap-8 border-t border-neutral-300 pt-7 lg:grid-cols-[.34fr_1.66fr] lg:gap-12">
            <p className="text-[10px] tracking-[.16em] text-neutral-500">{copy.strategyLabel}</p>
            <p className="max-w-3xl text-lg font-light leading-8 md:text-2xl md:leading-10">{programBody}</p>
          </div>
        )}
      </section>

      <section className="px-6 pb-24 pt-20 sm:px-8 md:px-10 md:pb-32 md:pt-28 lg:px-16">
        <div className="grid gap-9 border-t border-neutral-300 pt-7 lg:grid-cols-[.34fr_1.66fr] lg:gap-12">
          <p className="text-[10px] tracking-[.16em] text-neutral-500">{copy.scopeLabel}</p>
          <div>
            <h2 className={titleClass + " max-w-5xl text-[clamp(2.9rem,6vw,6rem)]"}>{copy.scopeTitle}</h2>
            {designScope.length > 0 && (
              <ol className="mt-14 border-t border-neutral-300 md:mt-20">
                {designScope.map((item, index) => (
                  <li key={item} className="grid grid-cols-[45px_1fr] items-baseline gap-4 border-b border-neutral-300 py-6 md:grid-cols-[75px_1fr] md:py-8">
                    <span className="text-[10px] tabular-nums tracking-[.16em] text-[#4F6B7A]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-xl font-light leading-8 md:text-[clamp(1.6rem,3vw,2.8rem)] md:leading-[1.3]">{item}</span>
                  </li>
                ))}
              </ol>
            )}
            {supervisionBody && (
              <div className="mt-14 grid gap-6 border-t border-neutral-300 pt-7 sm:grid-cols-[.5fr_1.5fr] md:mt-20">
                <p className="text-[10px] tracking-[.12em] text-[#4F6B7A]">{copy.supervisionLabel}</p>
                <p className="max-w-2xl text-base font-light leading-8 text-neutral-600">{supervisionBody}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="bg-[#eeece7] px-6 pb-24 pt-20 sm:px-8 md:px-10 lg:px-16">
          <p className="border-t border-neutral-300 pt-7 text-[10px] tracking-[.16em] text-neutral-500">{copy.extraLabel}</p>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {gallery.map((src, index) => (
              <a key={src} href={src} target="_blank" rel="noopener noreferrer" className={(index === 0 && gallery.length % 2 === 1 ? "md:col-span-2 " : "") + "group relative block aspect-[4/3] overflow-hidden bg-neutral-300"}>
                <Image src={src} alt={translated.title + " — " + String(index + 1)} fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.025]" />
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 pb-28 pt-20 sm:px-8 md:px-10 md:pb-36 md:pt-28 lg:px-16">
        <div className="grid gap-9 border-t border-neutral-300 pt-7 lg:grid-cols-[.34fr_1.66fr] lg:gap-12">
          <p className="text-[10px] tracking-[.16em] text-neutral-500">{copy.closingLabel}</p>
          <div>
            <h2 className={titleClass + " max-w-5xl text-[clamp(3.5rem,9vw,9rem)]"}>{copy.closingTitle}</h2>
            <Link href="/contact" className="mt-10 inline-flex items-center gap-5 border-b border-neutral-500 pb-3 text-[10px] uppercase tracking-[.16em] transition-opacity hover:opacity-50">
              {copy.closingAction} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <Link href="/projects" className="mt-20 inline-flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-neutral-500 transition-colors hover:text-neutral-900">
          <span aria-hidden="true">←</span> {copy.returnLabel}
        </Link>
      </section>
    </main>
  );
}
