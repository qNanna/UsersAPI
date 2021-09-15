import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class Utils {
  // eslint-disable-next-line no-useless-escape
  private EMAIL_PATTERN: RegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  private IV: Buffer = Buffer.from('12345678', 'utf16le'); // 2 bytes per char

  public encryptData(data: string, key: string) : string {
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(key), this.IV);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  public decryptData(data: string, key: string) : string {
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(key), this.IV);
    let decrypted = decipher.update(Buffer.from(data, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  public async readFile(path: string) : Promise<Object | null> {
    try {
      const buf = await fs.readFile(path);
      return JSON.parse(buf.toString());
    } catch {
      return null;
    }
  }

  public isEmail(mail: string) : boolean {
    return this.EMAIL_PATTERN.test(mail);
  }

  public jwtVerify(token: string, key: string) {
    try {
      return jwt.verify(token, key);
    } catch (err) { 
      return { error: { message: err } }
    }
  } 
}
