import React, { useState } from 'react';
import Layout from './Layout';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('app')} />;
  }

  return (
    <Layout onGoHome={() => setView('landing')}>
      <Dashboard />
    </Layout>
  );
};

export default App;