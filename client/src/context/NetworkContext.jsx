import React, { createContext, useState, useContext } from 'react';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [logs, setLogs] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const updateDeviceStatus = (id, newStatus, newConfig = {}) => {
    setDevices(prev => 
      prev.map(dev => dev.id === id ? { ...dev, status: newStatus, ...newConfig } : dev)
    );
    if (selectedDevice?.id === id) {
      setSelectedDevice(prev => ({ ...prev, status: newStatus, ...newConfig }));
    }
  };

  return (
    <NetworkContext.Provider
      value={{
        devices,
        setDevices,
        selectedDevice,
        setSelectedDevice,
        updateDeviceStatus,
        logs,
        addLog,
        toasts,
        addToast,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetworkContext = () => useContext(NetworkContext);
