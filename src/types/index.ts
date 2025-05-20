import { ENC_TYPE } from '../core/encoder.js';

export interface IdGeneratorOptions {
  size?: number;
  segments?: number;
  separator?: string;
  encoding?: ENC_TYPE | ENC_TYPE[];
  prefix?: string;
  includeTimestamp?: boolean;
  alphabet?: string;
  compression?: 'none' | 'lz77' | 'gzip';
  reversible?: boolean;
}

export interface CollisionStrategy {
  name: string;
  maxAttempts: number;
  backoffType: 'linear' | 'exponential';
  checkFunction: (id: string) => Promise<boolean>;
}

export interface ContextOptions {
  includeDevice?: boolean;
  includeTimezone?: boolean;
  includeBrowser?: boolean;
  includeScreen?: boolean;
  includeLocation?: boolean;
  userBehavior?: string;
}

export interface SemanticOptions {
  prefix?: string;
  region?: string;
  department?: string;
  year?: number;
  customSegments?: Record<string, string | number>;
}

export interface BatchOptions {
  count: number;
  format?: 'standard' | 'nano' | 'short' | 'uuid';
  parallel?: boolean;
  ensureUnique?: boolean;
}

export interface ValidationOptions {
  checkFormat?: boolean;
  checkCollisions?: boolean;
  repairCorrupted?: boolean;
}

export interface HealthScore {
  score: number;
  entropy: 'low' | 'medium' | 'high';
  predictability: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface Stats {
  generated: number;
  collisions: number;
  averageGenerationTime: string;
  memoryUsage: string;
  distributionScore: number;
}

export interface MigrationOptions {
  from: string;
  to: string;
  preserveOrder?: boolean;
  batchSize?: number;
  ids?: string[];
  count?: number;
}

export interface CompatibilityOptions {
  platform: ('javascript' | 'python' | 'go')[];
  format: string;
  length: number;
}
