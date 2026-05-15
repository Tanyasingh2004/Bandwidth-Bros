const mongoose = require('mongoose');
const { Schema } = mongoose;

const configTemplateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  commands: [{ type: String }],
  device_type: { type: String, default: "cisco-ios" }
}, { timestamps: true });

module.exports = mongoose.model('ConfigTemplate', configTemplateSchema);
