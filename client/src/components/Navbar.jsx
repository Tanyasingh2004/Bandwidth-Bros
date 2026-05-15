import React from 'react';
import { Activity, Wifi } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 40px',
      borderBottom: '1px solid var(--panel-border)',
      background: 'rgba(11, 15, 25, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'var(--accent-blue-transparent)',
          padding: '8px',
          borderRadius: '8px',
          color: 'var(--accent-blue)'
        }}>
          <Activity size={24} />
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>
          Automatic Configuration Tool
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Wifi size={18} color="var(--status-configured)" />
        <span style={{ fontSize: '0.9rem', color: 'var(--status-configured)', fontWeight: 500 }}>
          System Online
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
