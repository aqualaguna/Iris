// Nodejs encryption with CTR
import crypto = require('crypto');
const algorithm = 'aes-256-cbc';

export function encrypt(text: string, key: any) {
 const iv = crypto.randomBytes(16);
 const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

export function decrypt(text: any, key: any) {
 const iv = Buffer.from(text.iv, 'hex');
 const encryptedText = Buffer.from(text.encryptedData, 'hex');
 const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}