const { exec } = require('child_process');

function getArpTable() {
  return new Promise((resolve, reject) => {
    // Run arp -a to get the ARP cache
    exec('arp -a', (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        console.error('ARP stderr:', stderr);
      }

      const arpMap = {};
      const lines = stdout.split('\n');
      
      // Parse output based on Windows arp -a format
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          const ip = parts[0];
          const mac = parts[1].replace(/-/g, ':'); // Convert Windows MAC to standard format
          
          if (/^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac)) {
            arpMap[ip] = mac;
          }
        }
      }
      
      resolve(arpMap);
    });
  });
}

module.exports = { getArpTable };
