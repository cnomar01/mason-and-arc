"use client";

import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";

const content = {
  en: {
    label: "What we do",
    title: ["Four practices.", "One point of view."],
    items: [
      ["Architecture & Interiors", "Space / Proportion / Detail"],
      ["Branding & Creative Direction", "Identity / Voice / Character"],
      ["Visualization & Communication", "Image / Motion / Story"],
      ["Digital Experiences", "Interface / Interaction / Craft"],
    ],
  },
  ar: {
    label: "ما نعمل عليه",
    title: ["أربع ممارسات.", "ورؤية واحدة."],
    items: [
      ["العمارة والتصميم الداخلي", "المكان / النِسب / التفاصيل"],
      ["الهوية والتوجيه الإبداعي", "الهوية / الصوت / الشخصية"],
      ["التصور والتواصل", "الصورة / الحركة / الحكاية"],
      ["التجارب الرقمية", "الواجهة / التفاعل / الإتقان"],
    ],
  },
  it: {
    label: "Cosa facciamo",
    title: ["Quattro pratiche.", "Un solo punto di vista."],
    items: [
      ["Architettura & Interni", "Spazio / Proporzione / Dettaglio"],
      ["Branding & Direzione Creativa", "Identità / Voce / Carattere"],
      ["Visualizzazione & Comunicazione", "Immagine / Movimento / Narrazione"],
      ["Esperienze Digitali", "Interfaccia / Interazione / Cura"],
    ],
  },
} as const;

export default function Disciplines() {
  const { locale } = useLocale();
  const copy = content[locale];

  return (
    <section className="bg-[#f8f7f4] px-6 py-24 text-neutral-900 sm:px-8 md:px-10 md:py-32 lg:px-16">
      <div className="grid gap-9 border-t border-neutral-300 pt-7 lg:grid-cols-[.35fr_1.65fr] lg:gap-12">
        <p className="text-[9px] uppercase tracking-[.3em] text-neutral-500">{copy.label}</p>
        <Reveal>
          <h2 className="max-w-5xl text-[clamp(3rem,6.8vw,6.5rem)] font-light leading-[.94] tracking-[-.05em]">
            {copy.title[0]}<br />{copy.title[1]}
          </h2>
        </Reveal>
      </div>

      <div className="mt-16 border-t border-neutral-300 md:mt-20">
        {copy.items.map(([name, focus], index) => (
          <Reveal key={name}>
            <Link
              href={"/services#discipline-" + (index + 1)}
              className="group relative grid gap-x-8 gap-y-3 overflow-hidden border-b border-neutral-300 py-8 transition-colors duration-500 hover:bg-neutral-900/[0.035] md:grid-cols-[44px_minmax(0,1fr)_minmax(170px,.45fr)_28px] md:items-center md:py-11"
            >
              <span className="absolute inset-y-0 start-0 w-[2px] origin-top scale-y-0 bg-[#4F6B7A] transition-transform duration-500 group-hover:scale-y-100" aria-hidden="true" />
              <span className="ps-3 text-[10px] tracking-[.2em] text-[#4F6B7A] md:ps-2">0{index + 1}</span>
              <h3 className={locale === "ar"
                ? "ps-3 text-[clamp(1.8rem,3.5vw,3.7rem)] font-light leading-[1.1] transition-transform duration-500 group-hover:translate-x-1 md:ps-0"
                : "ps-3 text-[clamp(1.8rem,3.5vw,3.7rem)] font-light leading-[1.02] tracking-[-.045em] transition-transform duration-500 group-hover:translate-x-1 md:ps-0"
              }>
                {name}
              </h3>
              <p className="ps-3 text-[9px] uppercase leading-5 tracking-[.12em] text-neutral-500 md:ps-0 md:text-[10px]">
                {focus}
              </p>
              <span className="hidden text-lg font-light text-neutral-600 transition-transform duration-500 group-hover:translate-x-1 md:block" aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
