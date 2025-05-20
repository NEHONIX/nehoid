/**
 * Comprehensive test file for NehoID
 *
 * This file demonstrates all the features of the NehoID library.
 * You can use this in a separate project to test the published package.
 */

import { NehoID, EncodingPipeline } from "./dist";

// ===== TESTING BASIC FUNCTIONALITY =====
console.log("\n===== BASIC FUNCTIONALITY TESTS =====\n");

// Test standard ID generation
const standardId = NehoID.generate();
console.log("Standard ID:", standardId);

// Test UUID generation
const uuidId = NehoID.uuid();
console.log("UUID:", uuidId);

// Test NanoID generation
const nanoId = NehoID.nanoid();
console.log("NanoID:", nanoId);

// Test short ID generation
const shortId = NehoID.short();
console.log("Short ID:", shortId);

// Test hex ID generation
const hexId = NehoID.hex();
console.log("Hex ID:", hexId);

// ===== TESTING ADVANCED FUNCTIONALITY =====
console.log("\n===== ADVANCED FUNCTIONALITY TESTS =====\n");

// Test batch generation
const batchIds = NehoID.batch({ count: 5 });
console.log("Batch IDs (5):", batchIds);

// Test ID validation
const isValid = NehoID.validate(standardId);
console.log(`Is ID '${standardId}' valid:`, isValid);

// Test ID health check
const healthCheck = NehoID.healthCheck(standardId);
console.log("ID Health Check:", healthCheck);

// ===== TESTING V2 ADVANCED FEATURES =====
console.log("\n===== V2 ADVANCED FEATURES TESTS =====\n");

// Test quantum ID generation
const quantumId = NehoID.quantum({ entanglementGroup: "test-group" });
console.log("Quantum ID:", quantumId);

// Test biometric ID generation
const biometricId = NehoID.biometric({
  fingerprint: "fp_test_hash",
  keystrokeDynamics: [0.32, 0.45, 0.67],
});
console.log("Biometric ID:", biometricId);

// Test blockchain ID generation
const blockchainId = NehoID.blockchain({
  networkId: "test-net",
  consensusType: "proof-of-stake",
});
console.log("Blockchain ID:", blockchainId);

// Test pattern-embedded ID generation
const patternId = NehoID.patternEmbedded("user-behavior-pattern");
console.log("Pattern-embedded ID:", patternId);

// Test recursive ID generation
const recursiveId = NehoID.recursive(2);
console.log("Recursive ID (depth 2):", recursiveId);

// Test fractal ID generation
const fractalId = NehoID.fractal(3, 0.7);
console.log("Fractal ID (3 iterations, 0.7 complexity):", fractalId);

// ===== TESTING COMBINATION METHODS =====
console.log("\n===== COMBINATION METHODS TESTS =====\n");

// Test ultimate ID generation
const ultimateId = NehoID.ultimate({
  quantumGroup: "secure-session",
  biometricData: { fingerprint: "fp_hash", voicePrint: "vp_hash" },
  mlFeatures: [0.7, 0.2, 0.9],
});
console.log("Ultimate ID:", ultimateId);

// Test predictive sequence generation
const predictiveSequence = NehoID.predictiveSequence(3);
console.log("Predictive Sequence Base ID:", predictiveSequence.baseId);
console.log("Predictive Sequence IDs:", predictiveSequence.sequenceIds);
console.log("Materialized ID (index 1):", predictiveSequence.materialize(1));

// ===== TESTING DYNAMIC ID SYSTEMS =====
console.log("\n===== DYNAMIC ID SYSTEMS TESTS =====\n");

// Test adaptive system
const adaptiveSystem = NehoID.createAdaptiveSystem({});
const adaptiveId1 = adaptiveSystem.generateNext();
console.log("Adaptive ID 1:", adaptiveId1);
const adaptiveId2 = adaptiveSystem.generateNext("user-login");
console.log("Adaptive ID 2 (with context):", adaptiveId2);
console.log("Evolution History:", adaptiveSystem.getEvolutionHistory());

// Test fluid pool
const fluidPool = NehoID.createFluidPool(5);
const fluidId = fluidPool.draw();
console.log("Fluid ID from pool:", fluidId);
fluidPool.replenish(2);
console.log("Pool size after replenish:", fluidPool.poolSize());

// ===== TESTING ID TRANSFORMATION =====
console.log("\n===== ID TRANSFORMATION TESTS =====\n");

// Test destiny-bound ID
const destinyId = NehoID.destinyBound("successful-outcome");
console.log("Destiny-bound ID:", destinyId.id);
console.log("Manifested Destiny ID:", destinyId.manifestDestiny());
console.log("Altered Fate ID:", destinyId.alterFate("alternative-outcome"));

// ===== PERFORMANCE TESTS =====
console.log("\n===== PERFORMANCE TESTS =====\n");

// Test generation performance
console.time("Generate 1000 IDs");
for (let i = 0; i < 1000; i++) {
  NehoID.generate();
}
console.timeEnd("Generate 1000 IDs");

// Test batch generation performance
console.time("Batch generate 1000 IDs");
NehoID.batch({ count: 1000 });
console.timeEnd("Batch generate 1000 IDs");

// Test V2 generation performance
console.time("Generate 100 Quantum IDs");
for (let i = 0; i < 100; i++) {
  NehoID.quantum();
}
console.timeEnd("Generate 100 Quantum IDs");

console.log("\n===== ALL TESTS COMPLETED =====\n");
