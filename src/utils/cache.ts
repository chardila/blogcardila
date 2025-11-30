// Simple file-based cache for BGG API responses
import fs from 'node:fs';
import path from 'node:path';

const CACHE_DIR = '.cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCacheFilePath(key: string): string {
  // Create a safe filename from the key
  const safeKey = key.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return path.join(CACHE_DIR, `${safeKey}.json`);
}

export function getCachedData<T>(key: string): T | null {
  try {
    const filePath = getCacheFilePath(key);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const cacheEntry: CacheEntry<T> = JSON.parse(fileContent);

    // Check if cache is still valid
    const now = Date.now();
    if (now - cacheEntry.timestamp > CACHE_TTL) {
      // Cache expired, delete it
      fs.unlinkSync(filePath);
      return null;
    }

    console.log(`[Cache] Hit for key: ${key}`);
    return cacheEntry.data;
  } catch (error) {
    console.error(`[Cache] Error reading cache for key ${key}:`, error);
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  try {
    ensureCacheDir();
    const filePath = getCacheFilePath(key);

    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };

    fs.writeFileSync(filePath, JSON.stringify(cacheEntry, null, 2), 'utf-8');
    console.log(`[Cache] Saved key: ${key}`);
  } catch (error) {
    console.error(`[Cache] Error writing cache for key ${key}:`, error);
  }
}

export function clearCache(key?: string): void {
  try {
    if (key) {
      // Clear specific cache entry
      const filePath = getCacheFilePath(key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[Cache] Cleared key: ${key}`);
      }
    } else {
      // Clear entire cache directory
      if (fs.existsSync(CACHE_DIR)) {
        const files = fs.readdirSync(CACHE_DIR);
        for (const file of files) {
          fs.unlinkSync(path.join(CACHE_DIR, file));
        }
        console.log('[Cache] Cleared all cache');
      }
    }
  } catch (error) {
    console.error('[Cache] Error clearing cache:', error);
  }
}
