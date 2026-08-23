import { generateCompatibleUuid } from './crypto-id-generator';

describe('generateCompatibleUuid', () => {
  it('uses randomUUID when the browser exposes it', () => {
    const expected = '11111111-2222-4333-8444-555555555555';

    expect(generateCompatibleUuid({ randomUUID: () => expected })).toBe(expected);
  });

  it('falls back to getRandomValues when randomUUID is unavailable', () => {
    const uuid = generateCompatibleUuid({
      getRandomValues: (array) => {
        array.forEach((_, index) => { array[index] = index; });
        return array;
      },
    });

    expect(uuid).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f');
  });

  it('falls back when randomUUID exists but is rejected by the browser context', () => {
    const uuid = generateCompatibleUuid({
      randomUUID: () => { throw new DOMException('Not allowed', 'SecurityError'); },
      getRandomValues: (array) => {
        array.fill(0xaa);
        return array;
      },
    });

    expect(uuid).toBe('aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa');
  });
});
