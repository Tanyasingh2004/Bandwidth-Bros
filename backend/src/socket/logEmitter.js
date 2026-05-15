function emitLog(io, message, success = true) {
  if (!io) return;
  io.emit("log", {
    message,
    success,
    timestamp: new Date().toISOString()
  });
}

module.exports = { emitLog };
