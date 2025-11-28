/**
 * Decoded coupon data structure matching backend payload
 * Contains display data + storeId (securely encrypted)
 */
export interface DecodedCouponData {
  code: string;
  expiresAt: string;
  createdAt: string;
  storeId: string; // Added for staff redemption
  store: {
    name: string;
    description?: string;
    address?: string;
    city?: string;
    phoneNumber?: string;
    averageRating?: number;
    reviewCounter?: number;
  };
  discount: {
    title: string;
    description?: string;
    type: string;
    value: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
  };
}

/**
 * Time remaining structure for countdown display
 */
export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

/**
 * Coupon decoder utility
 * Handles decryption of AES-256-GCM encrypted coupon data from URLs
 */
export class CouponDecoder {
  /**
   * Decrypt and decode coupon data from URL (synchronous)
   * Format: {iv}.{encrypted}.{authTag}
   * Note: This only works in Node.js environment (SSR). For client-side, use decodeAsync()
   */
  static decode(encryptedData: string): DecodedCouponData {
    try {
      // Split the encrypted data into components and treat as fixed 3-tuple
      const parts = encryptedData.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid encrypted data format");
      }

      const [ivBase64, encrypted, authTagBase64] = parts as [
        string,
        string,
        string,
      ];

      // Only works in Node.js environment
      if (typeof window !== "undefined") {
        throw new Error("Use decodeAsync() in browser environment");
      }

      return this.decryptNode(ivBase64, encrypted, authTagBase64);
    } catch (error) {
      throw new Error(
        "Invalid coupon data: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  /**
   * Decrypt and decode coupon data from URL (asynchronous)
   * Format: {iv}.{encrypted}.{authTag}
   * Works in both browser and Node.js environments
   */
  static async decodeAsync(encryptedData: string): Promise<DecodedCouponData> {
    try {
      // Split the encrypted data into components and treat as fixed 3-tuple
      const parts = encryptedData.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid encrypted data format");
      }

      const [ivBase64, encrypted, authTagBase64] = parts as [
        string,
        string,
        string,
      ];

      // Use Web Crypto API for browser or Node.js crypto for server
      if (typeof window !== "undefined") {
        // Browser environment - use Web Crypto API
        return await this.decryptBrowser(ivBase64, encrypted, authTagBase64);
      } else {
        // Node.js environment (SSR)
        return this.decryptNode(ivBase64, encrypted, authTagBase64);
      }
    } catch (error) {
      throw new Error(
        "Invalid coupon data: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  /**
   * Decrypt using Node.js crypto (for SSR)
   */
  private static decryptNode(
    ivBase64: string,
    encrypted: string,
    authTagBase64: string
  ): DecodedCouponData {
    // Require Node.js crypto dynamically. Rule disabled because this file is shared
    // between browser and server bundles; using `require` avoids bundling Node crypto into client code.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require("crypto");

    // Get encryption key from environment
    const encryptionKey = process.env.NEXT_PUBLIC_COUPON_ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length !== 64) {
      throw new Error("Encryption key not configured");
    }

    // Convert from base64url and hex
    const key = Buffer.from(encryptionKey, "hex");
    const iv = Buffer.from(ivBase64, "base64url");
    const authTag = Buffer.from(authTagBase64, "base64url");

    // Decrypt using AES-256-GCM
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "base64url", "utf8");
    decrypted += decipher.final("utf8");

    const data: DecodedCouponData = JSON.parse(decrypted);
    this.validateStructure(data);

    return data;
  }

  /**
   * Decrypt using Web Crypto API (for browser)
   */
  private static async decryptBrowser(
    ivBase64: string,
    encrypted: string,
    authTagBase64: string
  ): Promise<DecodedCouponData> {
    // Get encryption key from environment
    const encryptionKey = process.env.NEXT_PUBLIC_COUPON_ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length !== 64) {
      throw new Error("Encryption key not configured");
    }

    // Convert hex key to bytes
    const keyBytes = new Uint8Array(
      encryptionKey.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    // Import the key
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBytes.buffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // Decode base64url to bytes
    const iv = this.base64urlToBytes(ivBase64);
    const ciphertext = this.base64urlToBytes(encrypted);
    const authTag = this.base64urlToBytes(authTagBase64);

    // Combine ciphertext and auth tag (Web Crypto expects them together)
    const combined = new Uint8Array(ciphertext.length + authTag.length);
    combined.set(ciphertext);
    combined.set(authTag, ciphertext.length);

    // Decrypt (pass Uint8Array views directly; Web Crypto accepts BufferSource)
    // Cast to BufferSource to satisfy TypeScript DOM typings (iv.buffer can be ArrayBufferLike)
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as unknown as BufferSource },
      cryptoKey,
      combined as unknown as BufferSource
    );

    // Convert to string and parse
    const jsonString = new TextDecoder().decode(decrypted);
    const data: DecodedCouponData = JSON.parse(jsonString);
    this.validateStructure(data);

    return data;
  }

  /**
   * Convert base64url string to Uint8Array
   */
  private static base64urlToBytes(base64url: string): Uint8Array {
    // Convert base64url to base64
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const base64Padded = base64 + padding;

    // Decode base64
    const binary = atob(base64Padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Validate the structure of decoded data
   */
  private static validateStructure(
    data: unknown
  ): asserts data is DecodedCouponData {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data structure");
    }

    const obj = data as Record<string, unknown>;
    const required = [
      "code",
      "expiresAt",
      "createdAt",
      "storeId",
      "store",
      "discount",
    ];
    for (const field of required) {
      if (!(field in obj)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const store = (obj.store ?? {}) as Record<string, unknown>;
    if (!store?.name) {
      throw new Error("Invalid store data");
    }

    const discount = (obj.discount ?? {}) as Record<string, unknown>;
    if (!discount?.title || !discount?.type || discount?.value === undefined) {
      throw new Error("Invalid discount data");
    }
  }

  /**
   * Calculate time remaining until expiration
   */
  static getTimeRemaining(expiresAt: string): TimeRemaining {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds, expired: false };
  }

  /**
   * Format expiration time as human-readable string
   */
  static formatExpirationTime(expiresAt: string): string {
    const { hours, minutes, seconds, expired } =
      this.getTimeRemaining(expiresAt);

    if (expired) {
      return "Expired";
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Check if coupon is expired
   */
  static isExpired(expiresAt: string): boolean {
    return new Date(expiresAt) <= new Date();
  }

  /**
   * Format discount value for display
   */
  static formatDiscountValue(type: string, value: number): string {
    if (type === "percentage") {
      return `${value}% OFF`;
    } else if (type === "fixed") {
      return `$${value} OFF`;
    } else {
      return `${value} OFF`;
    }
  }
}
