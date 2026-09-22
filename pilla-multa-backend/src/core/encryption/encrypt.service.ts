import * as argon2 from 'argon2';

export class EncryptService {
  public static encrypt(text: string) {
    return argon2.hash(text);
  }

  public static async verify(
    encryptText: string,
    text: string,
  ): Promise<boolean> {
    return await argon2.verify(encryptText, text);
  }
}
