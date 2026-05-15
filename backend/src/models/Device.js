const mongoose = require('mongoose');
const { Schema } = mongoose;

const deviceSchema = new Schema({
  hostname:  { type: String, default: "unknown-device" },
  ip:        { type: String, required: true, unique: true },
  mac:       { type: String, default: "N/A" },
  status:    { 
    type: String, 
    enum: ["pending", "configured", "error", "scanning", "unreachable"],
    default: "pending" 
  },
  last_seen: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
