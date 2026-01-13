export class EncryptionService {
    private static algorithm = { name: 'AES-GCM', length: 256 };

    // Generate a key from a password
    static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        return window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt as any,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            this.algorithm,
            false,
            ["encrypt", "decrypt"]
        );
    }

    static async encrypt(text: string, key: CryptoKey): Promise<{ cipherText: ArrayBuffer; iv: Uint8Array }> {
        const enc = new TextEncoder();
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const cipherText = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv as any
            },
            key,
            enc.encode(text)
        );
        return { cipherText, iv };
    }

    static async decrypt(cipherText: ArrayBuffer, iv: Uint8Array, key: CryptoKey): Promise<string> {
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv as any
            },
            key,
            cipherText
        );
        const dec = new TextDecoder();
        return dec.decode(decrypted);
    }

    // Helpers to convert to/from storage formats (Base64)
    static arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    static base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binary_string = atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
