// src/lib/cache.ts

import React, { useCallback, useState } from "react";
import { QueryState } from "./useFetch";

// import { fetchConfig } from "../utils/fetchConfig";

interface CachedResponse {
    body: string;
    queryFn: (payload?: unknown) => Promise<Response>;
    setState: React.Dispatch<React.SetStateAction<QueryState<unknown>>>;
}

type CacheEntry<T> = {
    data: T;
    expiry: number;
};
// const expiresIn = fetchConfig.cacheTime || 60 *1000;
export const cache: Map<string, CacheEntry<CachedResponse>> = new Map();

/**
 * Retrieves data from the cache if it exists and hasn't expired.
 *
 * @param {string} key - The key of the cached data.
 * @returns {CachedResponse | null} The cached data if available and valid, or null if not found or expired.
 */
export function getFromCache(key: string): CachedResponse | null {
    const entry = cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
        cache.delete(key);
        return null;
    }

    return entry.data;
}

/**
 * Stores data in the cache with an expiration time.
 *
 * @param {string} key - The key under which to store the cached data.
 * @param {CachedResponse} data - The data to be cached.
 * @param {number} [expiresIn=60000] - Optional expiration time in milliseconds. Defaults to 1 minute.
 */
export function setToCache(key: string, data: CachedResponse, expiresIn: number = 60 * 1000): void {
    // Default Cache time is 1 min
    const expiry = Date.now() + expiresIn;
    cache.set(key, { data, expiry });
}

/**
 * Clears the cached data for the specified key.
 *
 * @param {string} key - The key of the cached data to remove.
 */
export function clearCache(key: string): void {
    cache.delete(key);
}