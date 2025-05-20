# NehoID - Advanced Unique ID Generation Utility

## 🌟 What Makes NehoID Special?

Unlike other ID generators, NehoID provides:

- **Multi-Layer Encoding**: Advanced encoding pipeline with 20+ encoding types
- **Smart Collision Detection**: Built-in collision avoidance with configurable strategies
- **Context-Aware Generation**: Device, location, and behavior-aware IDs
- **Advanced Analytics**: Performance monitoring and ID distribution analysis
- **Format Migration**: Tools to migrate between ID formats
- **Batch Operations**: High-performance bulk ID generation
- **Custom Alphabets**: Support for domain-specific character sets
- **ID Health Scoring**: Validate and score ID quality

## 📦 Installation

```bash
npm install nehoid
# or
yarn add nehoid
# or
bun add nehoid
```

## 🚀 Quick Start

```typescript
import { NehoID } from "nehoid";

// Basic usage
const id = NehoID.generate();
console.log(id); // "6a617977416b714d-7938716a56515a52-79764d5a50775555"

// Advanced usage with collision detection
const safeId = await NehoID.safe({
  strategy: "retry",
  maxAttempts: 3,
  checkFunction: async (id) => !(await database.exists(id)),
});

// Context-aware ID
const contextId = NehoID.contextual({
  includeDevice: true,
  includeLocation: true,
  userBehavior: "returning-customer",
});
```

## 🎯 Core Features

### 1. Multiple ID Types

```typescript
// Standard formats
NehoID.uuid(); // Standard UUID v4
NehoID.nanoid(); // NanoID compatible
NehoID.short(); // URL-safe short ID
NehoID.hex(); // Hexadecimal ID

// Advanced formats
NehoID.hierarchical(); // Parent-child relationships
NehoID.temporal(); // Time-ordered IDs
NehoID.semantic(); // Meaningful prefixes
NehoID.sequential(); // Database-friendly sequence
```

### 2. Smart Collision Detection

```typescript
const collisionSafeId = await NehoID.safe({
  strategy: "exponential-backoff",
  maxAttempts: 5,
  checkFunction: async (id) => {
    return !(await yourDatabase.exists("users", id));
  },
});
```

### 3. Advanced Encoding Pipeline

```typescript
NehoID.generate({
  encoding: ["base64", "hex", "rot13"], // Multi-layer encoding
  compression: "lz77", // Optional compression
  alphabet: "ABCDEFGHIJKLMNOPQR", // Custom alphabet
  reversible: true, // Enable reverse engineering
});
```

### 4. Batch Operations

```typescript
// Generate thousands of IDs efficiently
const batchIds = NehoID.batch({
  count: 10000,
  format: "nano",
  parallel: true,
  ensureUnique: true,
});

// Bulk validation
const validation = NehoID.validateBatch(existingIds, {
  checkFormat: true,
  checkCollisions: true,
  repairCorrupted: true,
});
```

### 5. Analytics & Monitoring

```typescript
// Performance monitoring
NehoID.startMonitoring();
const stats = NehoID.getStats();
/*
{
  generated: 15420,
  collisions: 0,
  averageGenerationTime: '0.12ms',
  memoryUsage: '2.1MB',
  distributionScore: 0.98
}
*/

// ID health scoring
const health = NehoID.healthCheck("your-id-here");
/*
{
  score: 0.95,
  entropy: 'high',
  predictability: 'low',
  recommendations: ['increase_length']
}
*/
```

### 6. Context-Aware Generation

```typescript
// Device-aware IDs
const deviceId = NehoID.contextual({
  includeDevice: true, // Device fingerprint
  includeTimezone: true, // User timezone
  includeBrowser: true, // Browser info
  includeScreen: true, // Screen resolution
});

// Business context
const businessId = NehoID.semantic({
  prefix: "ORDER",
  region: "US-WEST",
  department: "SALES",
  year: 2024,
}); // Result: "ORDER-USWEST-SALES-2024-a7b9c2d4"
```

### 7. Migration & Compatibility

```typescript
// Migrate old IDs to new format
const migrated = NehoID.migrate({
  from: "uuid",
  to: "nehoid-v2",
  preserveOrder: true,
  batchSize: 1000,
});

// Cross-platform compatibility
const compatible = NehoID.compatible({
  platform: ["javascript", "python", "go"],
  format: "base64",
  length: 16,
});
```

## 🔧 Advanced Configuration

```typescript
import { NehoID, CollisionStrategy, EncodingPipeline } from "nehoid";

// Custom collision strategy
const customStrategy: CollisionStrategy = {
  name: "database-check",
  maxAttempts: 3,
  backoffType: "exponential",
  checkFunction: async (id) => {
    return !(await myDatabase.findById(id));
  },
};

// Custom encoding pipeline
const pipeline = new EncodingPipeline()
  .addEncoder("base64")
  .addCompression("gzip")
  .addEncoder("hex")
  .enableReversibility();

const id = NehoID.generate({
  strategy: customStrategy,
  pipeline: pipeline,
  metadata: {
    createdBy: "user-service",
    version: "2.1.0",
  },
});
```

## 📊 Performance Benchmarks

| Operation       | NehoID | uuid  | nanoid | shortid |
| --------------- | ------ | ----- | ------ | ------- |
| Generate 1K IDs | 0.8ms  | 1.2ms | 1.0ms  | 2.1ms   |
| Batch 100K IDs  | 45ms   | 78ms  | 62ms   | 180ms   |
| Collision Check | 0.1ms  | N/A   | N/A    | N/A     |
| Memory Usage    | 1.2MB  | 2.1MB | 1.8MB  | 3.2MB   |

## 🛠 API Reference

### Core Methods

- `NehoID.generate(options?)` - Generate basic ID
- `NehoID.safe(options)` - Generate with collision detection
- `NehoID.batch(options)` - Bulk generation
- `NehoID.validate(id, options?)` - Validate ID format
- `NehoID.healthCheck(id)` - Score ID quality

### Specialized Generators

- `NehoID.uuid()` - Standard UUID
- `NehoID.nanoid(length?)` - NanoID format
- `NehoID.short(length?)` - Short URL-safe ID
- `NehoID.hex(length?)` - Hexadecimal ID
- `NehoID.contextual(options)` - Context-aware ID
- `NehoID.semantic(options)` - Semantic/meaningful ID

### Utilities

- `NehoID.decode(id)` - Reverse engineer ID (if reversible)
- `NehoID.migrate(options)` - Migrate ID formats
- `NehoID.compatible(options)` - Cross-platform compatible IDs
- `NehoID.startMonitoring()` - Enable performance monitoring
- `NehoID.getStats()` - Get generation statistics

## 🔒 Security Features

- Cryptographically secure random generation
- Timing attack resistance
- No predictable patterns
- Optional encryption layer
- Audit trail support

## 🌐 Framework Integrations

```typescript
// Express.js middleware
app.use(
  NehoID.middleware({
    header: "X-Request-ID",
    format: "short",
  })
);

// Database ORM integration
const User = model("User", {
  id: {
    type: String,
    default: () => NehoID.generate({ prefix: "usr" }),
  },
});
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

We welcome contributions! See CONTRIBUTING.md for guidelines.

## 📞 Support

- 📧 Email: support@nehonix.space
- 🐛 Issues: [GitHub Issues](https://github.com/nehonix/nehoid/issues)
- 📖 Docs: [Full Documentation](https://lab.nehonix.space)
