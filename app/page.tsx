import Hero from './components/Hero';
import CredibilityStrip from './components/CredibilityStrip';
import ValueSection from './components/ValueSection';
import CaseStudies from './components/CaseStudies';
import AIProjects from './components/AIProjects';
import Process from './components/Process';
import About from './components/About';
import TwoDoorCTA from './components/TwoDoorCTA';
import Footer from './components/Footer';
import PageScaleWrapper from './components/transitions/PageScaleWrapper';
import { getContent } from '@/lib/content';

export default function Home() {
  const content = getContent();
  
  return (
    <>
      {/* Hero stays outside PageScaleWrapper to avoid scaling issues with canvas */}
      <Hero />
      
      <PageScaleWrapper>
        <main className="min-h-screen w-full overflow-x-hidden bg-background relative">
          {content.sections.showCredibilityStrip && <CredibilityStrip />}
          {content.sections.showValueSection && <ValueSection />}
          {content.sections.showCaseStudies && <CaseStudies />}
          {content.sections.showAIProjects && <AIProjects />}
          {content.sections.showProcess && <Process />}
          {content.sections.showAbout && <About />}
          {content.sections.showTwoDoorCTA && <TwoDoorCTA />}
        </main>
        <Footer />
      </PageScaleWrapper>
    </>
  );
}

