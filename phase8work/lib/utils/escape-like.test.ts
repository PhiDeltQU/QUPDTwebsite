import { describe, it, expect } from 'vitest';
import { escapeLikePattern } from './escape-like';

describe('escapeLikePattern', () => {
  it('escapes % so it is matched literally, not as a wildcard', () => {
    expect(escapeLikePattern('100%sure@example.com')).toBe('100\\%sure@example.com');
  });

  it('escapes _ so it is matched literally, not as a single-char wildcard', () => {
    expect(escapeLikePattern('first_last@example.com')).toBe('first\\_last@example.com');
  });

  it('leaves ordinary characters untouched', () => {
    expect(escapeLikePattern('brother@example.edu')).toBe('brother@example.edu');
  });

  it('escapes multiple occurrences', () => {
    expect(escapeLikePattern('a%b_c%d')).toBe('a\\%b\\_c\\%d');
  });
});
