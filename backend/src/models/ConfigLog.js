const mongoose = require('mongoose');
const { Schema } = mongoose;

const configLogSchema = new Schema({
  device_id: { type: Schema.Types.ObjectId, ref: "Device", required: true },
  message:   { type: String, required: true },
  success:   { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ConfigLog', configLogSchema);
