import Hero from './components/Hero';
import CredibilityStrip from './components/CredibilityStrip';
import ValueSection from './components/ValueSection';
import CaseStudies from './components/CaseStudies';
import Process from './components/Process';
import About from './components/About';
import TwoDoorCTA from './components/TwoDoorCTA';
import Footer from './components/Footer';
export default function Home() {
  return (
    <>
      <main className="min-h-screen w-full overflow-x-hidden bg-background relative">
        <Hero />
        <CredibilityStrip />
        <ValueSection />
        <CaseStudies />
        <Process />
        <About />
        <TwoDoorCTA />
      </main>
      <Footer />
    </>
  );
}

