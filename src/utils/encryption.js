const fs = require('fs');
const crypto = require('crypto');

function readSecrets(callback) {
  fs.readFile('secrets.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read secrets.json');
      return callback(err);
    }
    try {
      const secrets = JSON.parse(data);
      callback(null, secrets);
    } catch (parseError) {
      console.error('Failed to parse secrets.json');
      callback(parseError);
    }
  });
}

function encrypt(text, callback) {
  readSecrets((err, secrets) => {
    if (err) {
      console.error('Error reading secrets:', err);
      return;
    }

    const cipher = crypto.createCipher('aes-256-cbc', secrets.encryptionKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    callback(encrypted);
  });
}

function decrypt(encryptedText, callback) {
  readSecrets((err, secrets) => {
    if (err) {
      console.error('Error reading secrets:', err);
      return;
    }

    const decipher = crypto.createDecipher('aes-256-cbc', secrets.encryptionKey);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    callback(decrypted);
  });
}
module.exports = {
    encrypt,
    decrypt
};
