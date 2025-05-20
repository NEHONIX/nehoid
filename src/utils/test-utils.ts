export function describe(name: string, fn: () => void) {
  console.log(`\n🔍 ${name}`);
  fn();
}

export function test(name: string, fn: () => void | Promise<void>) {
  try {
    const result = fn();
    if (result instanceof Promise) {
      result
        .then(() => console.log(`✅ ${name}`))
        .catch(err => console.error(`❌ ${name}\n   ${err.message}`));
    } else {
      console.log(`✅ ${name}`);
    }
  } catch (err) {
    console.error(`❌ ${name}\n   ${(err as Error).message}`);
  }
}

export function expect<T>(actual: T) {
  const actualNum = typeof actual === 'number' ? actual : Number(actual);
  return {
    toBe: (expected: T) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toEqual: (expected: T) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy: () => {
      if (!actual) {
        throw new Error(`Expected ${actual} to be truthy`);
      }
    },
    toBeFalsy: () => {
      if (actual) {
        throw new Error(`Expected ${actual} to be falsy`);
      }
    },
    toMatch: (regex: RegExp) => {
      if (!regex.test(String(actual))) {
        throw new Error(`Expected ${actual} to match ${regex}`);
      }
    },
    toHaveLength: (length: number) => {
      const actualLength = (actual as any[]).length;
      if (actualLength !== length) {
        throw new Error(`Expected length ${length} but got ${actualLength}`);
      }
    },
    toContain: (item: any) => {
      if (!(actual as any[]).includes(item)) {
        throw new Error(`Expected ${actual} to contain ${item}`);
      }
    },
    toBeGreaterThan: (expected: number) => {
      if (actualNum <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toThrow: (expected?: string | RegExp) => {
      try {
        (actual as Function)();
        throw new Error('Expected function to throw');
      } catch (err) {
        if (expected) {
          const errorMessage = (err as Error).message;
          if (expected instanceof RegExp) {
            if (!expected.test(errorMessage)) {
              throw new Error(`Expected error message to match ${expected} but got "${errorMessage}"`);
            }
          } else if (errorMessage !== expected) {
            throw new Error(`Expected error message "${expected}" but got "${errorMessage}"`);
          }
        }
      }
    }
  };
}
