import React from 'react';
import Layout from './Layout';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default App;
