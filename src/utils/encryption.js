import crypto from "crypto";
import secrets from "../../secrets.json" assert { type: "json" };

export const encrypt = (input) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    secrets.ENCRYPTION_KEY,
    Buffer.alloc(16)
  );
  let encrypted = cipher.update(`${input}`, "utf8", "hex");
  encrypted += cipher.final("hex").slice(0, 16);
  return encrypted;
};
