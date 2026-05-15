const API_BASE = 'http://localhost:5000/api/network';

export const scanNetwork = async () => {
  const response = await fetch(`${API_BASE}/scan`);
  if (!response.ok) throw new Error('Failed to scan network');
  return response.json();
};

export const getDevices = async () => {
  const response = await fetch(`${API_BASE}/devices`);
  if (!response.ok) throw new Error('Failed to get devices');
  return response.json();
};

export const applyConfig = async (deviceId, config) => {
  const response = await fetch(`${API_BASE}/devices/${deviceId}/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error('Failed to apply config');
  return response.json();
};

export const getConfigStatus = async (deviceId) => {
  const response = await fetch(`${API_BASE}/devices/${deviceId}/status`);
  if (!response.ok) throw new Error('Failed to get config status');
  const data = await response.json();
  return data.status;
};

export const getTopology = async () => {
  const response = await fetch(`${API_BASE}/topology`);
  if (!response.ok) throw new Error('Failed to get topology');
  return response.json();
};

export const getLogs = async () => {
  const response = await fetch(`${API_BASE}/logs`);
  if (!response.ok) throw new Error('Failed to get logs');
  return response.json();
};
