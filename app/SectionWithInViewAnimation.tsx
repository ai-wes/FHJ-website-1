import React from "react";
import { SpanizeText } from "../components/SpanizeText";
import { useInView } from "../components/useInView";

export function SectionWithInViewAnimation() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <section
      className="py-16 md:py-24 relative why-we-exist-gradient"
      ref={ref}
    >
      <div className="container px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl bg-white/95 dark:bg-neutral-800/95 shadow-2xl border-2 border-primary p-6 md:p-8 text-center relative overflow-hidden backdrop-blur-md">
            <SpanizeText
              as="h2"
              text="Why We Exist"
              className="text-xl md:text-3xl lg:text-4xl font-extrabold uppercase mb-2 tracking-tight text-white"
              delayStep={0.09}
              animate={inView}
            />
            <div className="w-10 h-1 mx-auto my-4 rounded-full bg-primary/60 opacity-70 mb-6" />
            <SpanizeText
              as="p"
              text={
                "The Future Human Journal is a curator-critic hybrid: we hunt down the most consequential advances in human enhancement, stress-test their claims, and translate the signal into plain language you can act on."
              }
              className="text-sm md:text-base text-white mb-12"
              delayStep={0.03}
              animate={inView}
            />
            <ul className="text-left text-base md:text-lg text-white mb-0 mx-auto max-w-2xl flex flex-col gap-4 pl-4 border-l-2 border-primary/20 mt-10">
              {[
                [
                  "AI × Transhumanism",
                  "— self-replicating agents, brain-computer symbiosis, emergent ethics.",
                ],
                [
                  "Synthetic Biology",
                  "— CRISPR, lab-grown organs, programmable cells as living factories.",
                ],
                [
                  "Longevity Science",
                  "— epigenetic clocks, telomerase drugs, and the economics of forever.",
                ],
                [
                  "Neurotechnology",
                  "— cortical arrays, memory implants, neurorights debates.",
                ],
                [
                  "Digital Twins & Personalized Medicine",
                  "— virtual anatomy for real-world health decisions.",
                ],
                [
                  "Ethics & Society",
                  "— power, access, and the line between upgrade and inequality.",
                ],
              ].map(([title, desc], idx) => (
                <li key={title}>
                  <SpanizeText
                    as="span"
                    text={title + " "}
                    className="font-semibold text-white"
                    delayStep={0.03 + idx * 0.05}
                    animate={inView}
                  />
                  <SpanizeText
                    as="span"
                    text={desc}
                    className="font-light text-white"
                    delayStep={0.03 + idx * 0.009}
                    animate={inView}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base md:text-lg text-white">
              <em>
                Cut through the hype—get the full story in your inbox every
                week.
              </em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
