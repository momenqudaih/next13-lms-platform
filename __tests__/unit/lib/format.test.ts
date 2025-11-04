import { formatPrice } from '@/lib/format';

describe('formatPrice', () => {
  it('should format price correctly with default currency', () => {
    expect(formatPrice(29.99)).toBe('$29.99');
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(100)).toBe('$100.00');
  });

  it('should handle decimal places correctly', () => {
    expect(formatPrice(29.999)).toBe('$30.00');
    expect(formatPrice(29.001)).toBe('$29.00');
  });

  it('should handle large numbers', () => {
    expect(formatPrice(1000)).toBe('$1,000.00');
    expect(formatPrice(1000000)).toBe('$1,000,000.00');
  });

  it('should handle negative numbers', () => {
    expect(formatPrice(-29.99)).toBe('-$29.99');
  });
});