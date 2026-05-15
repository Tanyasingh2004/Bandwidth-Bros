import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkContext } from '../context/NetworkContext';
import ConfigForm from './ConfigForm';
import { X, Settings } from 'lucide-react';

const ConfigPanel = () => {
  const { selectedDevice, setSelectedDevice } = useNetworkContext();

  return (
    <AnimatePresence>
      {selectedDevice && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="glass-panel"
          style={{
            position: 'fixed',
            top: '80px', // Below navbar
            right: '24px',
            bottom: '220px', // Above status log
            width: '400px',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div style={{
            padding: '24px',
            borderBottom: '1px solid var(--panel-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings size={20} color="var(--accent-blue)" />
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Configure Device</h2>
            </div>
            <button 
              onClick={() => setSelectedDevice(null)}
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
                padding: '4px',
                borderRadius: '50%',
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Target</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{selectedDevice.hostname}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>MAC: {selectedDevice.mac}</p>
            </div>
            
            <ConfigForm device={selectedDevice} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfigPanel;
