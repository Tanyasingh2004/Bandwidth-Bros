const { scanSubnet } = require('../services/scanner.service');
const { pushConfig } = require('../services/configurator.service');
const { buildTopology } = require('../services/topology.service');
const { emitLog } = require('../socket/logEmitter');
const Device = require('../models/Device');
const ConfigLog = require('../models/ConfigLog');

async function scanNetwork(req, res) {
  try {
    const io = req.app.locals.io;
    emitLog(io, `Starting network scan on ${process.env.SCAN_SUBNET || "192.168.1.0/24"}...`);
    
    const devices = await scanSubnet();
    
    emitLog(io, `Scan completed. Found ${devices.length} devices.`);
    
    // Map _id to id for frontend compatibility
    const mappedDevices = devices.map(d => ({
      id: d._id.toString(),
      hostname: d.hostname,
      ip: d.ip,
      mac: d.mac,
      status: d.status
    }));
    
    res.json(mappedDevices);
  } catch (err) {
    console.error("Scan failed:", err.message);
    res.status(500).json({ error: "Scan failed", detail: err.message });
  }
}

async function getDevices(req, res) {
  try {
    const devices = await Device.find({});
    const mappedDevices = devices.map(d => ({
      id: d._id.toString(),
      hostname: d.hostname,
      ip: d.ip,
      mac: d.mac,
      status: d.status
    }));
    res.json(mappedDevices);
  } catch (err) {
    console.error("Get devices failed:", err.message);
    res.status(500).json({ error: "Failed to get devices", detail: err.message });
  }
}

async function getDeviceStatus(req, res) {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.json({ status: device.status });
  } catch (err) {
    res.status(500).json({ error: "Failed to get device status", detail: err.message });
  }
}

async function configureDevice(req, res) {
  try {
    const io = req.app.locals.io;
    const deviceId = req.params.id;
    const config = req.body;
    
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    emitLog(io, `Applying configuration to ${device.hostname || device.ip}...`);
    
    device.status = "scanning";
    if (config.hostname && config.hostname.trim() !== '') {
      device.hostname = config.hostname.trim();
    }
    await device.save();

    const result = await pushConfig(device.ip, config);
    
    // Log action to DB
    await ConfigLog.create({
      device_id: device._id,
      message: result.message,
      success: result.success
    });

    if (result.success) {
      device.status = "configured";
      // Update device IP if it was changed successfully
      if (config.ip && config.ip !== device.ip) {
        device.ip = config.ip;
      }
      emitLog(io, `Configuration applied successfully to ${device.hostname || device.ip}`);
    } else {
      device.status = "error";
      emitLog(io, `Failed to configure ${device.hostname || device.ip}: ${result.message}`, false);
    }
    
    await device.save();
    res.json(result);
  } catch (err) {
    console.error("Configure device failed:", err.message);
    try {
      const deviceId = req.params.id;
      const device = await Device.findById(deviceId);
      if (device && device.status === 'scanning') {
        device.status = 'error';
        await device.save();
      }
    } catch (saveErr) {
      console.error("Failed to reset device status:", saveErr.message);
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getTopology(req, res) {
  try {
    const topology = await buildTopology();
    res.json(topology);
  } catch (err) {
    console.error("Get topology failed:", err.message);
    res.status(500).json({ error: "Failed to get topology", detail: err.message });
  }
}

async function getLogs(req, res) {
  try {
    const logs = await ConfigLog.find({}).sort({ timestamp: -1 }).limit(100);
    const mappedLogs = logs.map(l => ({
      device_id: l.device_id.toString(),
      message: l.message,
      success: l.success,
      timestamp: l.timestamp
    }));
    res.json(mappedLogs);
  } catch (err) {
    console.error("Get logs failed:", err.message);
    res.status(500).json({ error: "Failed to get logs", detail: err.message });
  }
}

module.exports = {
  scanNetwork,
  getDevices,
  getDeviceStatus,
  configureDevice,
  getTopology,
  getLogs
};
