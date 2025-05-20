/**
 * EncodingPipeline class for NehoID
 * Provides a fluent interface for building encoding pipelines
 */

import { __processor__ } from "nehonix-uri-processor";
import { ENC_TYPE, Encoder } from "./encoder";

export class EncodingPipeline {
  private encoders: ENC_TYPE[] = [];
  private compressionMethod: "none" | "lz77" | "gzip" = "none";
  private isReversible: boolean = false;
  private metadata: Record<string, any> = {};

  /**
   * Add an encoder to the pipeline
   * @param encoder Encoding type to add
   * @returns The pipeline instance for chaining
   */
  addEncoder(encoder: ENC_TYPE): EncodingPipeline {
    this.encoders.push(encoder);
    return this;
  }

  /**
   * Add multiple encoders to the pipeline
   * @param encoders Array of encoding types to add
   * @returns The pipeline instance for chaining
   */
  addEncoders(encoders: ENC_TYPE[]): EncodingPipeline {
    this.encoders.push(...encoders);
    return this;
  }

  /**
   * Add compression to the pipeline
   * @param method Compression method to use
   * @returns The pipeline instance for chaining
   */
  addCompression(method: "lz77" | "gzip"): EncodingPipeline {
    this.compressionMethod = method;
    return this;
  }

  /**
   * Enable reversibility for the pipeline
   * @returns The pipeline instance for chaining
   */
  enableReversibility(): EncodingPipeline {
    this.isReversible = true;
    return this;
  }

  /**
   * Disable reversibility for the pipeline
   * @returns The pipeline instance for chaining
   */
  disableReversibility(): EncodingPipeline {
    this.isReversible = false;
    return this;
  }

  /**
   * Add metadata to the pipeline
   * @param key Metadata key
   * @param value Metadata value
   * @returns The pipeline instance for chaining
   */
  addMetadata(key: string, value: any): EncodingPipeline {
    this.metadata[key] = value;
    return this;
  }

  /**
   * Process input through the pipeline
   * @param input String to process
   * @returns Processed string
   */
  process(input: string): string {
    let result = input;

    // Apply encoders in sequence
    if (this.encoders.length > 0) {
      const enc = __processor__.encodeMultiple(result, this.encoders);
      result = enc.results[enc.results.length - 1].encoded;
    }

    // Apply compression if specified
    if (this.compressionMethod !== "none") {
      result = Encoder.compress(result, this.compressionMethod);
    }

    // If reversible, prepend metadata
    if (this.isReversible) {
      // Store pipeline configuration as a prefix
      const config = {
        e: this.encoders,
        c: this.compressionMethod,
        m: this.metadata,
      };

      // Convert to JSON and encode in base64
      const configStr = __processor__.encode(JSON.stringify(config), "base64");

      // Add as prefix with separator
      result = `${configStr}:${result}`;
    }

    return result;
  }

  /**
   * Reverse the pipeline processing (if reversible)
   * @param input Processed string to reverse
   * @returns Original string or null if not reversible
   */
  reverse(input: string): string | null {
    // Check if input has reversible format
    if (!input.includes(":")) {
      return null;
    }

    try {
      // Split into config and content
      const [configStr, content] = input.split(":", 2);

      // Decode and parse config
      const config = JSON.parse(atob(configStr));

      let result = content;

      // Reverse compression if applied
      if (config.c !== "none") {
        result = Encoder.decompress(result, config.c);
      }

      // Reverse encoders in reverse order
      if (config.e.length > 0) {
        result = Encoder.decode(result, config.e);
      }

      return result;
    } catch (e) {
      console.error("Error reversing pipeline:", e);
      return null;
    }
  }

  /**
   * Get the pipeline configuration
   * @returns Configuration object
   */
  getConfig(): {
    encoders: ENC_TYPE[];
    compression: "none" | "lz77" | "gzip";
    reversible: boolean;
    metadata: Record<string, any>;
  } {
    return {
      encoders: [...this.encoders],
      compression: this.compressionMethod,
      reversible: this.isReversible,
      metadata: { ...this.metadata },
    };
  }
}
