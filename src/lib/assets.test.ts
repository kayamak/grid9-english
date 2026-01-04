import { describe, it, expect, afterEach } from 'vitest';
import { getAssetPath } from './assets';

describe('getAssetPath', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return path as is if NEXT_PUBLIC_BASE_PATH is not set', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '';
    expect(getAssetPath('image.png')).toBe('/image.png');
    expect(getAssetPath('/image.png')).toBe('/image.png');
  });

  it('should prepend NEXT_PUBLIC_BASE_PATH if set', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/base';
    expect(getAssetPath('image.png')).toBe('/base/image.png');
    expect(getAssetPath('/image.png')).toBe('/base/image.png');
  });

  it('should not duplicate base path if already present', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/base';
    expect(getAssetPath('/base/image.png')).toBe('/base/image.png');
  });
});
