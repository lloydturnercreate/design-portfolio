import Field from '@/components/field/Field'
import Statement from '@/components/Statement'
import Projects from '@/components/Projects'
import About from '@/components/About'
import Footer from '@/components/Footer'

/**
 * The field is mounted once, outside the scroll flow, and everything below is a
 * phase of it. Sections carry no background of their own — where they need to be
 * readable, the field has already decayed underneath them (lib/field/phases.ts)
 * rather than being covered up.
 */
export default function Home() {
  return (
    <>
      <Field />
      <div aria-hidden className="page-grain" />

      {/*
        `relative` with no z-index, deliberately. A z-index on a positioned
        element opens a new stacking context, and mix-blend-difference only
        blends within its own — so giving this wrapper z-10 would isolate the
        type from the field and the knockout would silently do nothing. Stacking
        is handled by DOM order instead: the field is positioned and comes first,
        this is positioned and comes second, so it paints on top.
      */}
      <div className="relative">
        <Statement />
        <main>
          <Projects />
          <About />
        </main>
        {/*
          The close carries `#contact` itself — contact and the footer are one
          block now, not a utility section stacked above a wordmark.
        */}
        <Footer />
      </div>
    </>
  )
}
