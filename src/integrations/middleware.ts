/**
 * Express middleware integration for NehoID
 * Provides request ID generation and tracking
 */

import { NehoID } from "../index";

/**
 * Express middleware options
 */
export interface MiddlewareOptions {
  /** Header name to use for the request ID */
  header?: string;
  /** ID format to use */
  format?: "standard" | "uuid" | "short" | "nano";
  /** Whether to expose the ID as a response header */
  exposeHeader?: boolean;
  /** Whether to add the ID to the request object */
  addToRequest?: boolean;
  /** Custom ID generator function */
  generator?: () => string;
}

/**
 * Create Express middleware for request ID generation
 * @param options Middleware configuration options
 * @returns Express middleware function
 */
export function createMiddleware(options: MiddlewareOptions = {}) {
  const {
    header = "X-Request-ID",
    format = "short",
    exposeHeader = true,
    addToRequest = true,
    generator,
  } = options;

  // Return the middleware function
  return function nehoidMiddleware(req: any, res: any, next: Function) {
    // Generate or use existing ID
    let requestId = req.headers[header.toLowerCase()];

    if (!requestId) {
      // Generate new ID based on format or custom generator
      if (generator) {
        requestId = generator();
      } else if (format === "uuid") {
        requestId = NehoID.uuid();
      } else if (format === "nano") {
        requestId = NehoID.nanoid();
      } else if (format === "short") {
        requestId = NehoID.short();
      } else {
        requestId = NehoID.generate();
      }
    }

    // Add ID to request object if enabled
    if (addToRequest) {
      req.id = requestId;
    }

    // Add ID to response header if enabled
    if (exposeHeader) {
      res.setHeader(header, requestId);
    }

    // Continue with request
    next();
  };
}
