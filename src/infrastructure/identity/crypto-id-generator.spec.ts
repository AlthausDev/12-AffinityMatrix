import { generateCompatibleUuid } from './crypto-id-generator';

describe('generateCompatibleUuid', () => {
  it('uses randomUUID when the browser exposes it', () => {
    const expected = '11111111-2222-4333-8444-555555555555';

    expect(generateCompatibleUuid({ randomUuid: () => expected })).toBe(expected);
  });

  it('falls back to getRandomValues when randomUUID is unavailable', () => {
    const uuid = generateCompatibleUuid({
      fillRandomBytes: (array) => {
        array.forEach((_, index) => { array[index] = index; });
      },
    });

    expect(uuid).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f');
  });

  it('falls back when randomUUID exists but is rejected by the browser context', () => {
    const uuid = generateCompatibleUuid({
      randomUuid: () => { throw new DOMException('Not allowed', 'SecurityError'); },
      fillRandomBytes: (array) => { array.fill(0xaa); },
    });

    expect(uuid).toBe('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa');
  });
});
