import crypto from 'crypto';
import secrets from "../../secrets.json" assert { type: "json" };

export function encrypt(input) {
  const cipher = crypto.createCipher('aes-256-cbc', secrets.encryptionKey);
  let encrypted = cipher.update(input, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
