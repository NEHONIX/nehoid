const { NehoID } = require("../dist/index.js");
const { v4: uuidv4 } = require("uuid");
const { nanoid } = require("nanoid");

const iterations = 100000;

console.log(`Running benchmarks with ${iterations} iterations...\n`);

// NehoID benchmark
console.time("NehoID.generate()");
for (let i = 0; i < iterations; i++) {
  NehoID.generate();
}
console.timeEnd("NehoID.generate()");

// UUID benchmark
console.time("uuid.v4()");
for (let i = 0; i < iterations; i++) {
  uuidv4();
}
console.timeEnd("uuid.v4()");

// NanoID benchmark
console.time("nanoid()");
for (let i = 0; i < iterations; i++) {
  nanoid();
}
console.timeEnd("nanoid()");

// Memory usage
const used = process.memoryUsage();
console.log("\nMemory Usage:");
for (let key in used) {
  console.log(
    `${key}: ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
  );
}
