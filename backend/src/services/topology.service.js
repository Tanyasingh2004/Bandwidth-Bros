const Device = require('../models/Device');
const { getArpTable } = require('./arp.service');

async function buildTopology() {
  try {
    const devices = await Device.find({}).lean();
    let arpMap = {};
    
    try {
      arpMap = await getArpTable();
    } catch (err) {
      console.error("Could not fetch ARP table:", err.message);
    }

    const nodes = [];
    const edges = [];
    
    // Find gateway (usually .1)
    const gateway = devices.find(d => d.ip.endsWith('.1')) || devices[0];
    
    devices.forEach((device, index) => {
      // Check if reachable via ARP cache
      const isReachable = !!arpMap[device.ip];
      const isGateway = gateway && gateway._id.toString() === device._id.toString();
      
      nodes.push({
        id: device._id.toString(),
        type: isGateway ? 'input' : 'default',
        data: {
          label: device.hostname || device.ip,
          ip: device.ip,
          mac: device.mac !== "N/A" ? device.mac : (arpMap[device.ip] || "N/A"),
          status: isReachable && device.status === 'pending' ? 'unreachable' : device.status
        },
        position: { x: (index % 4) * 250 + 50, y: Math.floor(index / 4) * 150 + 50 } // Basic grid layout
      });
      
      // Build Edges
      if (gateway && device._id.toString() !== gateway._id.toString()) {
        let strokeColor = '#94a3b8'; // default gray
        
        if (device.status === 'configured') strokeColor = '#22c55e'; // green
        else if (device.status === 'pending') strokeColor = '#f59e0b'; // amber
        else if (device.status === 'error' || device.status === 'unreachable') strokeColor = '#ef4444'; // red
        
        edges.push({
          id: `e-${gateway._id}-${device._id}`,
          source: gateway._id.toString(),
          target: device._id.toString(),
          type: 'smoothstep',
          style: { stroke: strokeColor, strokeWidth: 2 }
        });
      }
    });

    return { nodes, edges };
  } catch (err) {
    console.error("Error building topology:", err.message);
    throw err;
  }
}

module.exports = { buildTopology };
