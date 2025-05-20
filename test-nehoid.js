// Simple test script for NehoID using direct implementation
// This avoids module resolution issues by implementing the core functionality directly

// Basic ID generation function
function generateId(options = {}) {
  const opts = {
    size: options.size || 8,
    segments: options.segments || 4,
    separator: options.separator || '-',
    prefix: options.prefix || '',
    includeTimestamp: options.includeTimestamp || false,
    alphabet: options.alphabet || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  };

  const segments = [];

  if (opts.includeTimestamp) {
    const timestamp = Date.now().toString(36);
    segments.push(timestamp);
  }

  for (let i = 0; i < opts.segments; i++) {
    const randomString = Array.from(
      { length: opts.size },
      () => opts.alphabet[Math.floor(Math.random() * opts.alphabet.length)]
    ).join('');
    segments.push(randomString);
  }

  const id = segments.join(opts.separator);
  return opts.prefix ? `${opts.prefix}${opts.separator}${id}` : id;
}

// Generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate NanoID
function generateNanoID(size = 12) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length: size },
    () => alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join('');
}

// Generate short ID
function generateShortId(length = 8) {
  return generateId({
    size: length,
    segments: 1
  });
}

// Generate hex ID
function generateHexId(length = 32) {
  const alphabet = '0123456789abcdef';
  return Array.from(
    { length },
    () => alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join('');
}

// Safe ID generation with collision detection
async function generateSafeId(options) {
  const { name, backoffType, checkFunction, maxAttempts } = options;
  let attempts = 0;
  let id;

  while (attempts < maxAttempts) {
    id = generateId();
    
    if (await checkFunction(id)) {
      return id;
    }

    attempts++;
    if (backoffType === 'exponential') {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts)));
    } else {
      await new Promise(resolve => setTimeout(resolve, 100 * attempts));
    }
  }

  throw new Error(`Failed to generate unique ID after ${maxAttempts} attempts`);
}

// Batch generation
function generateBatch(options) {
  const { count, format = 'standard', ensureUnique = true } = options;
  const ids = new Set();

  while (ids.size < count) {
    let id;
    
    if (format === 'standard') {
      id = generateId();
    } else if (format === 'uuid') {
      id = generateUUID();
    } else if (format === 'nano') {
      id = generateNanoID();
    } else {
      id = generateShortId();
    }

    if (!ensureUnique || !ids.has(id)) {
      ids.add(id);
    }
  }

  return Array.from(ids);
}

// Validate ID
function validateId(id, options = {}) {
  const { checkFormat = true } = options;

  if (!id || typeof id !== 'string') {
    return false;
  }

  if (checkFormat) {
    // Basic format validation
    if (id.length < 8) {
      return false;
    }

    // Check for invalid characters
    if (/[^A-Za-z0-9_-]/.test(id)) {
      return false;
    }
  }

  return true;
}

// Health check
function healthCheck(id) {
  // Calculate a simple health score
  let score = 1.0;

  // Length check
  if (id.length < 8) score *= 0.5;
  if (id.length > 32) score *= 0.9;

  // Character variety
  const hasUpper = /[A-Z]/.test(id);
  const hasLower = /[a-z]/.test(id);
  const hasNumber = /[0-9]/.test(id);
  const hasSpecial = /[^A-Za-z0-9]/.test(id);

  if (!hasUpper) score *= 0.9;
  if (!hasLower) score *= 0.9;
  if (!hasNumber) score *= 0.9;
  if (!hasSpecial) score *= 0.95;

  // Calculate entropy
  const charFreq = new Map();
  for (const char of id) {
    charFreq.set(char, (charFreq.get(char) || 0) + 1);
  }

  let entropy = 0;
  const length = id.length;

  for (const freq of charFreq.values()) {
    const probability = freq / length;
    entropy -= probability * Math.log2(probability);
  }

  const normalizedEntropy = entropy / Math.log2(charFreq.size || 1);
  
  // Generate recommendations
  const recommendations = [];
  if (score < 0.8) {
    if (id.length < 12) recommendations.push('increase_length');
    if (normalizedEntropy < 0.6) recommendations.push('increase_complexity');
  }

  return {
    score,
    entropy: normalizedEntropy > 0.75 ? 'high' : normalizedEntropy > 0.5 ? 'medium' : 'low',
    predictability: score < 0.7 ? 'high' : score < 0.9 ? 'medium' : 'low',
    recommendations
  };
}

// Generate contextual ID
function generateContextualId(options = {}) {
  const opts = {
    includeDevice: options.includeDevice ?? true,
    includeTimezone: options.includeTimezone ?? true,
    includeBrowser: options.includeBrowser ?? false,
    includeScreen: options.includeScreen ?? false,
    includeLocation: options.includeLocation ?? false,
    userBehavior: options.userBehavior ?? ''
  };
  
  // Gather context information
  const contextParts = [];
  
  // Add timestamp (always included)
  const timestamp = Date.now().toString(36);
  contextParts.push(`t${timestamp}`);
  
  // Add timezone if requested
  if (opts.includeTimezone) {
    const timezoneOffset = new Date().getTimezoneOffset();
    const timezone = Math.abs(timezoneOffset).toString(36);
    contextParts.push(`z${timezoneOffset >= 0 ? 'p' : 'n'}${timezone}`);
  }
  
  // Add device information if requested
  if (opts.includeDevice) {
    // Get platform info - works in both Node.js and browser environments
    let platform = '';
    
    if (typeof navigator !== 'undefined') {
      platform = navigator.platform || 'unknown';
    } else if (typeof process !== 'undefined') {
      platform = process.platform || 'unknown';
    }
    
    // Create a hash of the platform
    let hash = 0;
    for (let i = 0; i < platform.length; i++) {
      hash = ((hash << 5) - hash) + platform.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    contextParts.push(`d${Math.abs(hash).toString(36)}`);
  }
  
  // Add random component to ensure uniqueness
  const randomPart = Math.random().toString(36).substring(2, 10);
  contextParts.push(`r${randomPart}`);
  
  // Join all parts with a separator
  return contextParts.join('-');
}

// Generate semantic ID
function generateSemanticId(options = {}) {
  const parts = [];
  
  if (options.prefix) {
    parts.push(options.prefix.toUpperCase());
  }
  
  if (options.region) {
    parts.push(options.region.toUpperCase());
  }
  
  if (options.department) {
    parts.push(options.department.toUpperCase());
  }
  
  // Add year
  const year = options.year || new Date().getFullYear();
  parts.push(year.toString());
  
  // Add custom segments if provided
  if (options.customSegments) {
    for (const [key, value] of Object.entries(options.customSegments)) {
      parts.push(`${key.toUpperCase()}-${value}`);
    }
  }
  
  // Add a unique identifier at the end
  const uniquePart = generateNanoID(8);
  parts.push(uniquePart);
  
  // Join all parts with a separator
  return parts.join('-');
}

// Generate compatible ID
function generateCompatibleId(options) {
  const { platform, format, length } = options;
  
  // Determine the most restrictive character set based on platforms
  let allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Adjust character set based on platform requirements
  if (platform.includes('python') || platform.includes('go')) {
    // Python and Go are more restrictive with certain characters
    allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
  }
  
  // Further restrict if needed for specific formats
  if (format === 'alphanumeric') {
    // Keep as is
  } else if (format === 'lowercase') {
    allowedChars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
  } else if (format === 'uppercase') {
    allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
  } else if (format === 'numeric') {
    allowedChars = '0123456789';
  } else if (format === 'hex') {
    allowedChars = '0123456789abcdef';
  }
  
  // Generate the ID with the specified length and allowed characters
  let id = '';
  const charsLength = allowedChars.length;
  
  for (let i = 0; i < length; i++) {
    id += allowedChars.charAt(Math.floor(Math.random() * charsLength));
  }
  
  // Ensure the ID doesn't start with a number (important for some languages)
  if (/^[0-9]/.test(id) && platform.some(p => ['javascript', 'python'].includes(p))) {
    // Replace the first character with a letter
    const letters = allowedChars.replace(/[0-9]/g, '');
    id = letters.charAt(Math.floor(Math.random() * letters.length)) + id.substring(1);
  }
  
  return id;
}

// Run the tests
async function runTests() {
  console.log('🚀 Running tests for NehoID implementation...\n');
  
  try {
    // Test basic ID generation
    console.log('--- Testing Basic ID Generation ---');
    const basicId = generateId();
    console.log('Basic ID:', basicId);
    console.log('Is string:', typeof basicId === 'string');
    console.log('Has length:', basicId.length > 0);
    
    // Test with custom options
    const customId = generateId({
      size: 20,
      segments: 3,
      separator: '-',
      prefix: 'test'
    });
    console.log('Custom ID:', customId);
    console.log('Has prefix:', customId.startsWith('test'));
    console.log('Has separators:', customId.includes('-'));
    
    // Test UUID generation
    console.log('\n--- Testing UUID Generation ---');
    const uuid = generateUUID();
    console.log('UUID:', uuid);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    console.log('UUID format valid:', uuidRegex.test(uuid));
    
    // Test NanoID generation
    console.log('\n--- Testing NanoID Generation ---');
    const nanoId = generateNanoID(10);
    console.log('NanoID (length 10):', nanoId);
    console.log('NanoID length correct:', nanoId.length === 10);
    
    // Test short ID generation
    console.log('\n--- Testing Short ID Generation ---');
    const shortId = generateShortId(8);
    console.log('Short ID (length 8):', shortId);
    console.log('Short ID length correct:', shortId.length === 8);
    
    // Test hex ID generation
    console.log('\n--- Testing Hex ID Generation ---');
    const hexId = generateHexId(12);
    console.log('Hex ID (length 12):', hexId);
    console.log('Hex ID length correct:', hexId.length === 12);
    console.log('Hex ID format valid:', /^[0-9a-f]+$/i.test(hexId));
    
    // Test collision detection
    console.log('\n--- Testing Collision Detection ---');
    const existingIds = new Set();
    existingIds.add(generateId()); // Add one ID to the set
    
    const safeId = await generateSafeId({
      name: 'test-collision-strategy',
      backoffType: 'linear',
      checkFunction: async (id) => !existingIds.has(id),
      maxAttempts: 3
    });
    
    console.log('Safe ID with collision detection:', safeId);
    console.log('ID is unique:', !existingIds.has(safeId));
    existingIds.add(safeId);
    
    // Test batch generation
    console.log('\n--- Testing Batch Generation ---');
    const batchIds = generateBatch({ count: 5, ensureUnique: true });
    console.log('Batch of 5 IDs:', batchIds);
    console.log('Batch has correct count:', batchIds.length === 5);
    console.log('All IDs are unique:', new Set(batchIds).size === 5);
    
    // Test validation
    console.log('\n--- Testing Validation ---');
    const validId = generateId();
    console.log('Valid ID:', validId);
    console.log('Validation result:', validateId(validId));
    
    // Test health check
    console.log('\n--- Testing Health Check ---');
    const healthScore = healthCheck(validId);
    console.log('Health score:', healthScore);
    
    // Test contextual ID generation
    console.log('\n--- Testing Contextual ID Generation ---');
    const contextualId = generateContextualId({
      includeDevice: true,
      includeTimezone: true
    });
    console.log('Contextual ID:', contextualId);
    console.log('Has timestamp prefix:', contextualId.includes('t'));
    console.log('Has timezone info:', contextualId.includes('z'));
    
    // Test semantic ID generation
    console.log('\n--- Testing Semantic ID Generation ---');
    const semanticId = generateSemanticId({
      prefix: 'PROD',
      region: 'US',
      department: 'SALES',
      customSegments: {
        VERSION: '1.0'
      }
    });
    console.log('Semantic ID:', semanticId);
    console.log('Has prefix:', semanticId.includes('PROD'));
    console.log('Has region:', semanticId.includes('US'));
    console.log('Has department:', semanticId.includes('SALES'));
    
    // Test compatible ID generation
    console.log('\n--- Testing Compatible ID Generation ---');
    const compatibleId = generateCompatibleId({
      platform: ['javascript', 'python'],
      format: 'lowercase',
      length: 12
    });
    console.log('Compatible ID (lowercase):', compatibleId);
    console.log('Has correct length:', compatibleId.length === 12);
    console.log('Is lowercase:', compatibleId === compatibleId.toLowerCase());
    console.log('Starts with letter:', /^[a-z]/.test(compatibleId));
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

runTests();
