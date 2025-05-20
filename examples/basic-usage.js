const { NehoID } = require("nehoid");

// Basic usage
console.log("Basic ID:", NehoID.generate());

// Different formats
console.log("UUID:", NehoID.uuid());
console.log("Short:", NehoID.short());
console.log("Hex:", NehoID.hex(16));
console.log("NanoID:", NehoID.nanoid());

// Advanced features
const contextId = NehoID.contextual({
  includeDevice: true,
  includeTimezone: true,
});
console.log("Context ID:", contextId);

// Batch generation
const batchIds = NehoID.batch({
  count: 5,
  format: "short",
  ensureUnique: true,
});
console.log("Batch IDs:", batchIds);

// Health check
const health = NehoID.healthCheck("sample-id-12345");
console.log("Health Score:", health);
