const { exec } = require('child_process');
const Device = require('../models/Device');
const { getArpTable } = require('./arp.service');

async function scanSubnet(subnet = process.env.SCAN_SUBNET || "192.168.1.0/24") {
  return new Promise((resolve, reject) => {
    exec(`nmap -sn ${subnet}`, async (error, stdout, stderr) => {
      // If nmap fails (e.g., not installed on Windows), fallback to ARP cache
      if (error) {
        console.warn('Nmap is not installed or failed. Falling back to ARP cache...', error.message);
        try {
          const arpMap = await getArpTable();
          const results = [];
          for (const [ip, mac] of Object.entries(arpMap)) {
            if (ip.startsWith('224.') || ip.startsWith('239.') || ip.startsWith('255.') || ip.endsWith('.255')) continue;
            results.push({ ip, mac, hostname: 'unknown-device' });
          }
          
          for (const item of results) {
            await Device.findOneAndUpdate(
              { ip: item.ip },
              { 
                $set: { hostname: item.hostname, mac: item.mac, last_seen: new Date() },
                $setOnInsert: { status: "pending" }
              },
              { upsert: true, new: true }
            );
          }
          const allDevices = await Device.find({});
          return resolve(allDevices);
        } catch (arpErr) {
          return reject(new Error(`Both Nmap and ARP fallback failed: ${arpErr.message}`));
        }
      }

      try {
        const results = [];
        const lines = stdout.split('\n');
        
        let currentDevice = null;

        for (const line of lines) {
          if (line.startsWith('Nmap scan report for')) {
            if (currentDevice && currentDevice.ip) {
              results.push(currentDevice);
            }
            currentDevice = { ip: '', mac: 'N/A', hostname: 'unknown-device' };
            
            const match = line.match(/Nmap scan report for (.*?)(?:\s+\(([\d\.]+)\))?$/);
            if (match) {
              if (match[2]) {
                currentDevice.hostname = match[1];
                currentDevice.ip = match[2];
              } else {
                currentDevice.ip = match[1];
              }
            }
          } else if (line.startsWith('MAC Address:') && currentDevice) {
            const match = line.match(/MAC Address: ([0-9A-Fa-f:]+)/);
            if (match) {
              currentDevice.mac = match[1];
            }
          }
        }
        
        if (currentDevice && currentDevice.ip) {
          results.push(currentDevice);
        }

        for (const item of results) {
          if (!item.ip) continue;
          if (item.ip.startsWith('224.') || item.ip.startsWith('239.') || item.ip.startsWith('255.') || item.ip.endsWith('.255')) continue;
          await Device.findOneAndUpdate(
            { ip: item.ip },
            { 
              $set: { hostname: item.hostname, mac: item.mac, last_seen: new Date() },
              $setOnInsert: { status: "pending" }
            },
            { upsert: true, new: true }
          );
        }

        // Clean up any ghost devices previously saved
        await Device.deleteMany({
          $or: [
            { ip: /^224\./ },
            { ip: /^239\./ },
            { ip: /^255\./ },
            { ip: /\.255$/ }
          ]
        });

        const allDevices = await Device.find({});
        resolve(allDevices);

      } catch (dbErr) {
        reject(dbErr);
      }
    });
  });
}

module.exports = { scanSubnet };
