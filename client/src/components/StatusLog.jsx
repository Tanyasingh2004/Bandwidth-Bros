import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { useNetworkContext } from '../context/NetworkContext';

const StatusLog = () => {
  const { logs } = useNetworkContext();
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'var(--status-configured)';
      case 'error': return 'var(--status-error)';
      case 'warning': return 'var(--status-pending)';
      default: return 'var(--text-main)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '40px',
      right: '40px',
      height: '180px',
      background: 'rgba(10, 15, 25, 0.9)',
      border: '1px solid var(--panel-border)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: 'var(--glass-shadow)',
      zIndex: 40
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--panel-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.03)'
      }}>
        <Terminal size={16} color="var(--text-muted)" />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          System Log
        </span>
      </div>
      
      <div style={{
        padding: '16px',
        overflowY: 'auto',
        flex: 1,
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {logs.length === 0 ? (
          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>System initialized. Waiting for commands...</span>
        ) : (
          logs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>[{log.timestamp}]</span>
              <span style={{ color: getColor(log.type) }}>{log.message}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default StatusLog;
