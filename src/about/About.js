import { motion } from 'framer-motion';

import { ScrollSection, FadeInBlock, AboutAtmosphere } from './primitives';
import { HeroQuote, ObsessionStatement } from './Opening';
import { JudoQuote } from './Judo';
import { LeverageSection } from './Leverage';
import { RatioSection } from './Ratio';
import { AsymmetrySection } from './Asymmetry';
import { DealtBets } from './Bets';
import { EverywhereSection } from './Everywhere';
import { ContrastSection } from './Contrast';
import { FinalStatement } from './Final';
import { HobbiesSection, QuickFacts } from './Personal';

/* ════════════════════════════════════════
   ABOUT — the scroll narrative

   The strongest thing on the site, so the pacing is left as it was: the
   vortex assembling the sentence, the judo quote drawing character by
   character, the lever tilting to both scroll and cursor, the payoff curve
   whose capped floor draws in a moment while the uncapped rise takes four
   times the scroll, and the same lever returning perfectly level as "the
   most symmetric bet you can make".

   Each beat is its own file under src/about/. They used to live in App.js,
   which had grown to 1,600 lines and made every edit a risky splice.
   ════════════════════════════════════════ */
export default function About() {
  return (
    <>
      <AboutAtmosphere />
      <motion.div
        className="relative z-[1]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 1 — Hero quote */}
        <HeroQuote />

        {/* 2 — "I'm obsessed with this idea." */}
        <ObsessionStatement />

        {/* 3 — The judo principle */}
        <JudoQuote />

        {/* 4 — Leverage */}
        <LeverageSection />

        {/* 5 — results / effort */}
        <RatioSection />

        {/* 6 — Asymmetry, as a payoff curve drawn by scrolling */}
        <AsymmetrySection />

        {/* 7 — Worked examples, dealt like cards */}
        <DealtBets />

        {/* 8 — The turn */}
        <EverywhereSection />

        {/* 9 — Why people don't take them, and the level lever */}
        <ContrastSection />

        {/* 10 — Payoff */}
        <FinalStatement />

        {/* 11 — Who I am away from the argument */}
        <div className="px-6">
          <div className="mx-auto max-w-2xl space-y-8 pb-8 sm:space-y-12">
            <ScrollSection height="min-h-[20vh]">
              <div className="flex justify-center">
                <div className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
              </div>
            </ScrollSection>

            <FadeInBlock>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                about me
              </h2>
            </FadeInBlock>

            <HobbiesSection />
            <QuickFacts />
          </div>
        </div>
      </motion.div>
    </>
  );
}
