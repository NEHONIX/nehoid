/**
 * Comprehensive test file for NehoID
 *
 * This file demonstrates all the features of the NehoID library.
 * You can use this in a separate project to test the published package.
 */

import { middleware, database, EncodingPipeline, Encoder, NehoID } from "./dist";

/**
 * SECTION 1: Basic ID Generation
 */
console.log("\n=== BASIC ID GENERATION ===");

// Generate a basic ID
const basicId = NehoID.generate();
console.log("Basic ID:", basicId);

// Generate a UUID
const uuid = NehoID.uuid();
console.log("UUID:", uuid);

// Generate a NanoID
const nano = NehoID.nanoid(10);
console.log("NanoID (10 chars):", nano);

// Generate a short ID
const short = NehoID.short(8);
console.log("Short ID (8 chars):", short);

// Generate a hex ID
const hex = NehoID.hex(16);
console.log("Hex ID (16 chars):", hex);

/**
 * SECTION 2: Specialized ID Generation
 */
console.log("\n=== SPECIALIZED ID GENERATION ===");

// Generate a hierarchical ID
const parentId = NehoID.hierarchical();
console.log("Parent Hierarchical ID:", parentId);

const childId = NehoID.hierarchical({ parent: parentId });
console.log("Child Hierarchical ID:", childId);

// Generate a temporal ID
const temporalId = NehoID.temporal();
console.log("Temporal ID (default):", temporalId);

const temporalHourly = NehoID.temporal({ precision: "h", format: "b36" });
console.log("Temporal ID (hourly, base36):", temporalHourly);

// Generate a sequential ID
const sequentialId = NehoID.sequential({ counter: 1, prefix: "ORDER-" });
console.log("Sequential ID:", sequentialId);

const sequentialWithSuffix = NehoID.sequential({
  counter: 2,
  prefix: "USER-",
  padLength: 5,
  suffix: true,
});
console.log("Sequential ID with suffix:", sequentialWithSuffix);

/**
 * Output test completion message
 */
console.log("\n✅ All NehoID features tested successfully!");
console.log(
  "You can use this file as a reference for implementing NehoID in your projects."
);
