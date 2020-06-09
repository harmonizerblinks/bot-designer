import { isEmptyObject } from './misc';

describe('misc functions', () => {
  it('isEmptyObject()', () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({ a: 2, b: 3 })).toBe(false);
    expect(isEmptyObject(true)).toBe(false);
    expect(isEmptyObject(1)).toBe(false);
    expect(isEmptyObject([])).toBe(false);
  });
});
