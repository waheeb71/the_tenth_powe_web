
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import Projects from './components/Projects';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import AISmartAssistant from './components/AISmartAssistant';
import AdPopup from './components/AdPopup';

const App: React.FC = () => {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-grow">
        <Hero />
        <Stats />
        <Services />
        <Projects />
        <ContactForm />
      </main>

      <Footer />
      <FloatingActions onOpenAI={() => setShowAI(true)} />
      <AdPopup />

      {showAI && <AISmartAssistant onClose={() => setShowAI(false)} />}
    </div>
  );
};

export default App;
