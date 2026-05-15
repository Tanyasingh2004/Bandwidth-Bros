import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNetworkContext } from '../context/NetworkContext';
import { Server, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon, color, delay }) => {
  const [count, setCount] = useState(0);

  // Simple count-up effect
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) return;
    
    let totalDuration = 1000;
    let incrementTime = (totalDuration / end);
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel"
      style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flex: 1,
        minWidth: '200px'
      }}
    >
      <div style={{
        background: `rgba(${color}, 0.15)`,
        color: `rgb(${color})`,
        padding: '16px',
        borderRadius: '12px'
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</p>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{count}</h2>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { devices } = useNetworkContext();

  const total = devices.length;
  const configured = devices.filter(d => d.status === 'configured').length;
  const pending = devices.filter(d => d.status === 'pending').length;
  const errors = devices.filter(d => d.status === 'error').length;

  return (
    <div style={{ padding: '32px 40px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <StatCard 
        title="Total Devices" 
        value={total} 
        icon={<Server size={28} />} 
        color="59, 130, 246" 
        delay={0.1} 
      />
      <StatCard 
        title="Active Configs" 
        value={configured} 
        icon={<CheckCircle size={28} />} 
        color="16, 185, 129" 
        delay={0.2} 
      />
      <StatCard 
        title="Pending" 
        value={pending} 
        icon={<Clock size={28} />} 
        color="245, 158, 11" 
        delay={0.3} 
      />
      <StatCard 
        title="Errors" 
        value={errors} 
        icon={<AlertTriangle size={28} />} 
        color="239, 68, 68" 
        delay={0.4} 
      />
    </div>
  );
};

export default Dashboard;
