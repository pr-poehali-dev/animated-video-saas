import { useState } from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Gallery from '@/components/Gallery';
import Editor from '@/components/Editor';
import Profile from '@/components/Profile';
import Projects from '@/components/Projects';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'editor' | 'projects' | 'gallery' | 'profile'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      
      <main>
        {activeTab === 'home' && (
          <>
            <Hero onGetStarted={() => setActiveTab(isLoggedIn ? 'editor' : 'home')} />
            <Features />
            <Gallery />
            <Pricing />
          </>
        )}
        
        {activeTab === 'editor' && isLoggedIn && <Editor />}
        {activeTab === 'projects' && isLoggedIn && <Projects />}
        {activeTab === 'gallery' && <Gallery showAll />}
        {activeTab === 'profile' && isLoggedIn && <Profile />}
      </main>
    </div>
  );
};

export default Index;
