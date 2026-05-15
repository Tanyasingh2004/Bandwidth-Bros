import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkContext } from '../context/NetworkContext';
import { scanNetwork } from '../api/networkApi';
import DeviceCard from './DeviceCard';
import { Search } from 'lucide-react';

const DeviceScanner = () => {
  const { devices, setDevices, selectedDevice, setSelectedDevice, addLog } = useNetworkContext();
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    addLog('Initiating network scan...', 'info');
    
    try {
      const results = await scanNetwork();
      setDevices(results);
      addLog(`Scan complete. Found ${results.length} devices.`, 'success');
    } catch (error) {
      addLog('Error during network scan.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div style={{ padding: '0 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Discovered Devices</h2>
        <button 
          onClick={handleScan} 
          disabled={isScanning}
          className="btn-primary"
        >
          {isScanning ? (
            <div style={{ position: 'relative', width: '20px', height: '20px' }}>
              <div className="animate-pulse-ring" style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                border: '2px solid white',
                borderRadius: '50%'
              }}></div>
            </div>
          ) : <Search size={18} />}
          {isScanning ? 'Scanning...' : 'Scan Network'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
        <AnimatePresence>
          {devices.length === 0 && !isScanning && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                border: '1px dashed var(--panel-border)'
              }}
            >
              <Search size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>No devices discovered. Click 'Scan Network' to begin.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {devices.map((device, index) => (
          <DeviceCard 
            key={device.id} 
            device={device} 
            index={index}
            isSelected={selectedDevice?.id === device.id}
            onSelect={setSelectedDevice}
          />
        ))}
      </div>
    </div>
  );
};

export default DeviceScanner;
