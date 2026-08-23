import { IdGenerator } from '../../application/shared/id-generator';

type RandomUuid = () => string;
type FillRandomBytes = (array: Uint8Array) => void;

function browserRandomUuid(): RandomUuid | undefined {
  const api = globalThis.crypto;
  return typeof api?.randomUUID === 'function' ? () => api.randomUUID() : undefined;
}

function browserFillRandomBytes(): FillRandomBytes | undefined {
  const api = globalThis.crypto;
  return typeof api?.getRandomValues === 'function'
    ? (array) => { api.getRandomValues(array); }
    : undefined;
}

export function generateCompatibleUuid(
  randomUuid: RandomUuid | undefined = browserRandomUuid(),
  fillRandomBytes: FillRandomBytes | undefined = browserFillRandomBytes(),
): string {
  if (randomUuid) {
    try {
      return randomUuid();
    } catch {
      // Some browsers expose randomUUID but reject it outside a secure context.
    }
  }

  const bytes = new Uint8Array(16);
  if (fillRandomBytes) {
    fillRandomBytes(bytes);
  } else {
    // Profile ids are local identifiers rather than secrets. This final compatibility
    // fallback keeps creation working in very restricted/legacy browser contexts.
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  const hex = [...bytes].map((value) => value.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
}

export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return generateCompatibleUuid();
  }
}
