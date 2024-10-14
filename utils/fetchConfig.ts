export type FetchConfigType = {
    refetchOnWindowFocus?: boolean;
    cacheTime?: number
}
export const fetchConfig: FetchConfigType = {
    refetchOnWindowFocus: true,
    cacheTime: 60 * 1000 // 10 min
}