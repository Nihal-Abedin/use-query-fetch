// src/lib/cache.ts

import { useCallback, useState } from "react";

// import { fetchConfig } from "../utils/fetchConfig";

interface CachedResponse {
    body: string;
    status: number;
    statusText: string;
    headers: HeadersInit;
}

type CacheEntry<T> = {
    data: T;
    expiry: number;
};
// const expiresIn = fetchConfig.cacheTime || 60 *1000;
export const cache: Map<string, CacheEntry<CachedResponse>> = new Map();

export function getFromCache(key: string): CachedResponse | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
        cache.delete(key);
        return null;
    }

    return entry.data;
}

export function setToCache(key: string, data: CachedResponse, expiresIn: number = 60 * 1000): void {
    // Default Cache time is 1 min
    const expiry = Date.now() + expiresIn;
    cache.set(key, { data, expiry });
}

export function clearCache(key: string): void {
    cache.delete(key);
}
export function useCache() {
    const [cacheState, setCacheState] = useState<Map<string, CacheEntry<CachedResponse>>>(cache);

    const getFromCache = useCallback((key: string): CachedResponse | null => {
        const entry = cacheState.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            cacheState.delete(key);
            setCacheState(new Map(cacheState)); // Update state
            return null;
        }

        return entry.data;
    }, [cacheState]);

    const setToCache = useCallback((key: string, data: CachedResponse, expiresIn: number = 60 * 1000): void => {
        const expiry = Date.now() + expiresIn;
        const updatedCache = new Map(cacheState);
        updatedCache.set(key, { data, expiry });
        setCacheState(updatedCache);
    }, [cacheState]);

    const clearCache = useCallback((key: string): void => {
        const updatedCache = new Map(cacheState);
        updatedCache.delete(key);
        setCacheState(updatedCache);
    }, [cacheState]);

    return { getFromCache, setToCache, clearCache, cacheState };
}
