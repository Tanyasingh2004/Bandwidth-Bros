const mongoose = require('mongoose');
const { Schema } = mongoose;

const topologyEdgeSchema = new Schema({
  source_id:       { type: Schema.Types.ObjectId, ref: "Device" },
  target_id:       { type: Schema.Types.ObjectId, ref: "Device" },
  connection_type: { type: String, default: "ethernet" }
});

module.exports = mongoose.model('TopologyEdge', topologyEdgeSchema);
