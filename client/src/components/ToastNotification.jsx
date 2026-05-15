import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkContext } from '../context/NetworkContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastNotification = () => {
  const { toasts } = useNetworkContext();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} color="var(--status-configured)" />;
      case 'error': return <AlertCircle size={20} color="var(--status-error)" />;
      default: return <Info size={20} color="var(--accent-blue)" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      pointerEvents: 'none' // Let clicks pass through
    }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="glass-panel"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(20, 26, 41, 0.95)',
              minWidth: '300px',
              pointerEvents: 'auto'
            }}
          >
            {getIcon(toast.type)}
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
