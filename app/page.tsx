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

export default function Home() {
  return (
    <>
      {/* Hero stays outside PageScaleWrapper to avoid scaling issues with canvas */}
      <Hero />
      
      <PageScaleWrapper>
        <main className="min-h-screen w-full overflow-x-hidden bg-background relative">
          <CredibilityStrip />
          <ValueSection />
          <CaseStudies />
          <AIProjects />
          <Process />
          <About />
          <TwoDoorCTA />
        </main>
        <Footer />
      </PageScaleWrapper>
    </>
  );
}

