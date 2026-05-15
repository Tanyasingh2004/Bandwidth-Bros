import React from 'react';
import { motion } from 'framer-motion';
import { Network, ServerIcon, HelpCircle } from 'lucide-react';

const statusConfig = {
  configured: { color: 'var(--status-configured)', text: 'Configured' },
  pending: { color: 'var(--status-pending)', text: 'Pending' },
  error: { color: 'var(--status-error)', text: 'Error' },
  scanning: { color: 'var(--status-scanning)', text: 'Scanning' }
};

const DeviceCard = ({ device, onSelect, isSelected, index }) => {
  const status = statusConfig[device.status] || { color: 'var(--text-muted)', text: 'Unknown' };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={() => onSelect(device)}
      className="glass-panel"
      style={{
        padding: '20px',
        cursor: 'pointer',
        border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--panel-border)',
        boxShadow: isSelected ? '0 0 15px var(--accent-blue-transparent)' : 'var(--glass-shadow)',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px'
      }}
    >
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '12px',
        borderRadius: '50%',
        color: 'var(--text-main)'
      }}>
        {device.hostname.includes('router') ? <Network size={24} /> : 
         device.hostname.includes('switch') ? <ServerIcon size={24} /> : 
         <HelpCircle size={24} />}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{device.hostname}</h3>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '4px 8px',
            borderRadius: '12px',
            background: `${status.color}20`,
            color: status.color
          }}>
            {status.text}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span>IP: <span style={{ color: 'var(--text-main)' }}>{device.ip}</span></span>
          <span>MAC: <span style={{ color: 'var(--text-main)' }}>{device.mac}</span></span>
        </div>
      </div>
    </motion.div>
  );
};

export default DeviceCard;
