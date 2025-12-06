import React, { useState } from 'react';
import Layout from './Layout';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');

  const goToApp = () => {
      setView('app');
      window.scrollTo(0, 0);
  };

  const goToLanding = () => {
      setView('landing');
      window.scrollTo(0, 0);
  };

  if (view === 'landing') {
    return <LandingPage onStart={goToApp} />;
  }

  return (
    <Layout onGoHome={goToLanding}>
      <Dashboard />
    </Layout>
  );
};

export default App;