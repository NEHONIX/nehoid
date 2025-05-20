/**
 * Specialized ID generators for NehoID
 * Implements hierarchical, temporal, and sequential ID generation
 */

import { Generator } from './generator';

export class Specialized {
  /**
   * Generates a hierarchical ID with parent-child relationships
   * @param parent Optional parent ID to create a child under
   * @param level Hierarchy level (defaults to 1 if no parent, otherwise parent level + 1)
   * @param separator Character to separate hierarchy levels
   * @returns A hierarchical ID
   */
  static hierarchical(options: {
    parent?: string;
    level?: number;
    separator?: string;
  } = {}): string {
    const { parent, level: specifiedLevel, separator = '/' } = options;
    
    // Determine the level based on parent or specified level
    const level = specifiedLevel ?? (parent ? parent.split(separator).length + 1 : 1);
    
    // Generate a random segment for this level
    const segment = Generator.short(8);
    
    // If there's a parent, append to it; otherwise, start a new hierarchy
    if (parent) {
      return `${parent}${separator}${segment}`;
    } else {
      return `${level}${separator}${segment}`;
    }
  }
  
  /**
   * Generates a time-ordered ID for chronological sorting
   * @param precision Time precision ('ms', 's', 'm', 'h', 'd')
   * @param suffix Whether to add a random suffix for uniqueness
   * @returns A temporal ID with timestamp
   */
  static temporal(options: {
    precision?: 'ms' | 's' | 'm' | 'h' | 'd';
    suffix?: boolean;
    format?: 'hex' | 'dec' | 'b36';
  } = {}): string {
    const { precision = 'ms', suffix = true, format = 'hex' } = options;
    
    // Get current timestamp
    let timestamp = Date.now();
    
    // Adjust precision
    if (precision === 's') {
      timestamp = Math.floor(timestamp / 1000);
    } else if (precision === 'm') {
      timestamp = Math.floor(timestamp / 60000);
    } else if (precision === 'h') {
      timestamp = Math.floor(timestamp / 3600000);
    } else if (precision === 'd') {
      timestamp = Math.floor(timestamp / 86400000);
    }
    
    // Format timestamp
    let formattedTime: string;
    if (format === 'hex') {
      formattedTime = timestamp.toString(16).padStart(12, '0');
    } else if (format === 'b36') {
      formattedTime = timestamp.toString(36).padStart(8, '0');
    } else {
      formattedTime = timestamp.toString();
    }
    
    // Add random suffix if requested
    if (suffix) {
      const randomSuffix = Generator.short(6);
      return `${formattedTime}-${randomSuffix}`;
    } else {
      return formattedTime;
    }
  }
  
  /**
   * Generates a sequential ID suitable for database use
   * @param prefix Optional prefix for the ID
   * @param counter Current counter value
   * @param padLength Length to pad the counter to
   * @returns A sequential ID
   */
  static sequential(options: {
    prefix?: string;
    counter: number;
    padLength?: number;
    suffix?: boolean;
  }): string {
    const { prefix = '', counter, padLength = 10, suffix = false } = options;
    
    // Format the counter with padding
    const formattedCounter = counter.toString().padStart(padLength, '0');
    
    // Add random suffix if requested
    if (suffix) {
      const randomSuffix = Generator.short(4);
      return `${prefix}${formattedCounter}-${randomSuffix}`;
    } else {
      return `${prefix}${formattedCounter}`;
    }
  }
}
