import React from 'react';
import { NetworkProvider } from './context/NetworkContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DeviceScanner from './components/DeviceScanner';
import ConfigPanel from './components/ConfigPanel';
import StatusLog from './components/StatusLog';
import ToastNotification from './components/ToastNotification';

const AppContent = () => {
  return (
    <div style={{ paddingBottom: '220px' }}>
      <Navbar
  theme={theme}
  toggleTheme={toggleTheme}
/>
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
        <Dashboard />
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '24px',
          marginTop: '20px'
        }}>
          <DeviceScanner />
        </div>
      </main>

      <ConfigPanel />
      <StatusLog />
      <ToastNotification />
    </div>
  );
};

const App = () => {
  return (
    <NetworkProvider>
      <AppContent />
    </NetworkProvider>
  );
};

export default App;
