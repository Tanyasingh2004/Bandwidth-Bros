import React, { useState, useEffect } from 'react';
import { applyConfig } from '../api/networkApi';
import { useNetworkContext } from '../context/NetworkContext';
import { Save } from 'lucide-react';

const ConfigForm = ({ device }) => {
  const { addLog, addToast, updateDeviceStatus } = useNetworkContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hostname: '',
    ip: '',
    subnet: '255.255.255.0',
    gateway: '192.168.1.1',
    dns: '8.8.8.8',
    dhcp: false
  });

  useEffect(() => {
    if (device) {
      setFormData({
        hostname: device.hostname === 'unknown-device' ? '' : device.hostname,
        ip: device.ip !== 'unassigned' ? device.ip : '',
        subnet: '255.255.255.0',
        gateway: '192.168.1.1',
        dns: '8.8.8.8',
        dhcp: device.ip === 'unassigned'
      });
    }
  }, [device]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    addLog(`Applying configuration to ${device.hostname}...`, 'info');
    updateDeviceStatus(device.id, 'scanning');
    
    try {
      const response = await applyConfig(device.id, formData);
      if (response.success) {
        updateDeviceStatus(device.id, 'configured', { 
          ip: formData.dhcp ? '192.168.1.150' : formData.ip,
          hostname: formData.hostname || device.hostname
        });
        addLog(response.message, 'success');
        addToast(`Configured ${device.hostname} successfully`);
      } else {
        updateDeviceStatus(device.id, 'error');
        addLog(`Failed to configure ${device.hostname}: ${response.message}`, 'error');
        addToast('Configuration failed', 'error');
      }
    } catch (error) {
      updateDeviceStatus(device.id, 'error');
      addLog(`Failed to configure ${device.hostname}.`, 'error');
      addToast('Configuration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input 
          type="checkbox" 
          id="dhcp" 
          name="dhcp"
          checked={formData.dhcp}
          onChange={handleChange}
          style={{ width: '18px', height: '18px', accentColor: 'var(--accent-blue)' }}
        />
        <label htmlFor="dhcp" style={{ fontWeight: 500 }}>Enable DHCP (Auto-assign)</label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Device Name (Alias)</label>
        <input 
          type="text" 
          name="hostname"
          value={formData.hostname}
          onChange={handleChange}
          placeholder={device.hostname === 'unknown-device' ? "e.g. Living Room Switch" : device.hostname}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>IP Address</label>
        <input 
          type="text" 
          name="ip"
          value={formData.ip}
          onChange={handleChange}
          disabled={formData.dhcp}
          placeholder="e.g. 192.168.1.10"
          style={{ opacity: formData.dhcp ? 0.5 : 1 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subnet Mask</label>
        <input 
          type="text" 
          name="subnet"
          value={formData.subnet}
          onChange={handleChange}
          disabled={formData.dhcp}
          style={{ opacity: formData.dhcp ? 0.5 : 1 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Default Gateway</label>
        <input 
          type="text" 
          name="gateway"
          value={formData.gateway}
          onChange={handleChange}
          disabled={formData.dhcp}
          style={{ opacity: formData.dhcp ? 0.5 : 1 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>DNS Server</label>
        <input 
          type="text" 
          name="dns"
          value={formData.dns}
          onChange={handleChange}
          disabled={formData.dhcp}
          style={{ opacity: formData.dhcp ? 0.5 : 1 }}
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || (!formData.dhcp && !formData.ip)}
        className="btn-primary"
        style={{ marginTop: '10px' }}
      >
        <Save size={18} />
        {isSubmitting ? 'Applying...' : 'Apply Configuration'}
      </button>
    </form>
  );
};

export default ConfigForm;
