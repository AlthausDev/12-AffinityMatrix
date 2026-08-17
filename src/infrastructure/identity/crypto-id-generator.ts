import { IdGenerator } from '../../application/shared/id-generator';

export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
