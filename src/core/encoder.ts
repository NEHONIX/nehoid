import { __processor__ } from "nehonix-uri-processor";

export type ENC_TYPE =
  | "percentEncoding"
  | "doublepercent"
  | "base64"
  | "hex"
  | "unicode"
  | "htmlEntity"
  | "punycode"
  | "asciihex"
  | "asciioct"
  | "rot13"
  | "base32"
  | "urlSafeBase64"
  | "jsEscape"
  | "cssEscape"
  | "utf7"
  | "quotedPrintable"
  | "decimalHtmlEntity"
  | "rawHexadecimal"
  | "jwt"
  | "url"
  | "rawHex";

export class Encoder {
  static async encode(
    input: string,
    encodings: ENC_TYPE | ENC_TYPE[]
  ): Promise<string> {
    const encodingArray = Array.isArray(encodings) ? encodings : [encodings];
    let result = input;

    const enc = await __processor__.encodeMultipleAsync(result, encodingArray);

    result = enc.results[enc.results.length - 1].encoded;
    return result;
  }

  static decode(
    input: string,
    encodings: ENC_TYPE | ENC_TYPE[],
    opt?: {
      autoDetect?: boolean;
    }
  ): string {
    const encodingArray = Array.isArray(encodings) ? encodings : [encodings];
    let result = input;

    // Decode in reverse order
    for (const encoding of encodingArray.reverse()) {
      if (opt?.autoDetect) {
        result = __processor__.autoDetectAndDecode(result).val();
      } else {
        result = __processor__.decode(result, encoding);
      }
    }

    return result;
  }

  static compress(input: string, method: "lz77" | "gzip"): string {
    if (!input) return "";

    switch (method) {
      case "lz77":
        // Basic LZ77-inspired compression
        let compressed = "";
        let i = 0;

        while (i < input.length) {
          // Look for repeated sequences
          let maxLength = 0;
          let maxOffset = 0;

          // Search window (limited to previous 255 chars for simplicity)
          const searchLimit = Math.min(i, 255);

          for (let offset = 1; offset <= searchLimit; offset++) {
            let length = 0;
            while (
              i + length < input.length &&
              input[i - offset + length] === input[i + length] &&
              length < 255 // Limit match length
            ) {
              length++;
            }

            if (length > maxLength) {
              maxLength = length;
              maxOffset = offset;
            }
          }

          if (maxLength >= 4) {
            // Only use compression for sequences of 4+ chars
            // Format: <flag><offset><length><next char>
            compressed += String.fromCharCode(0xff); // Flag for compressed sequence
            compressed += String.fromCharCode(maxOffset);
            compressed += String.fromCharCode(maxLength);
            i += maxLength;
          } else {
            // Literal character
            if (input.charCodeAt(i) === 0xff) {
              // Escape the flag character
              compressed += String.fromCharCode(0xff) + String.fromCharCode(0);
            } else {
              compressed += input[i];
            }
            i++;
          }
        }

        return btoa(compressed); // Base64 encode for safe storage

      case "gzip":
        // For gzip, we'll use a dictionary-based approach since we can't use native gzip in browser
        const dictionary: Record<string, number> = {};
        let nextCode = 256; // Start after ASCII
        let result = [];

        // Initialize dictionary with single characters
        for (let i = 0; i < 256; i++) {
          dictionary[String.fromCharCode(i)] = i;
        }

        let currentSequence = "";

        for (let i = 0; i < input.length; i++) {
          const char = input[i];
          const newSequence = currentSequence + char;

          if (dictionary[newSequence] !== undefined) {
            currentSequence = newSequence;
          } else {
            // Output code for current sequence
            result.push(dictionary[currentSequence]);

            // Add new sequence to dictionary if there's room
            if (nextCode < 65536) {
              // Limit dictionary size
              dictionary[newSequence] = nextCode++;
            }

            currentSequence = char;
          }
        }

        // Output code for remaining sequence
        if (currentSequence !== "") {
          result.push(dictionary[currentSequence]);
        }

        // Convert to string and base64 encode
        return btoa(result.map((code) => String.fromCharCode(code)).join(""));

      default:
        return input;
    }
  }

  static decompress(input: string, method: "lz77" | "gzip"): string {
    if (!input) return "";

    switch (method) {
      case "lz77":
        try {
          // Base64 decode
          const compressed = atob(input);
          let decompressed = "";
          let i = 0;

          while (i < compressed.length) {
            if (compressed.charCodeAt(i) === 0xff) {
              i++;

              if (i < compressed.length && compressed.charCodeAt(i) === 0) {
                // Escaped flag character
                decompressed += String.fromCharCode(0xff);
                i++;
              } else if (i + 1 < compressed.length) {
                // Compressed sequence
                const offset = compressed.charCodeAt(i);
                const length = compressed.charCodeAt(i + 1);
                i += 2;

                // Copy sequence from already decompressed data
                const start = decompressed.length - offset;
                for (let j = 0; j < length; j++) {
                  decompressed += decompressed[start + j];
                }
              }
            } else {
              // Literal character
              decompressed += compressed[i];
              i++;
            }
          }

          return decompressed;
        } catch (e) {
          console.error("LZ77 decompression error:", e);
          return input;
        }

      case "gzip":
        try {
          // Base64 decode
          const compressed = atob(input);
          const codes = Array.from(compressed).map((char) =>
            char.charCodeAt(0)
          );

          // Initialize dictionary with single characters
          const dictionary: string[] = [];
          for (let i = 0; i < 256; i++) {
            dictionary[i] = String.fromCharCode(i);
          }

          let nextCode = 256;
          let result = "";
          let oldCode = codes[0];
          let character = dictionary[oldCode];
          result = character;

          for (let i = 1; i < codes.length; i++) {
            const code = codes[i];
            let entry: string;

            if (code < dictionary.length) {
              entry = dictionary[code];
            } else if (code === nextCode) {
              entry = character + character[0];
            } else {
              throw new Error("Invalid code");
            }

            result += entry;

            // Add to dictionary
            if (nextCode < 65536) {
              // Limit dictionary size
              dictionary[nextCode++] = character + entry[0];
            }

            character = entry;
          }

          return result;
        } catch (e) {
          console.error("Dictionary decompression error:", e);
          return input;
        }

      default:
        return input;
    }
  }
}
