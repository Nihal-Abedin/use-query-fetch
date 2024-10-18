import { FetchConfigType } from "../utils/fetchConfig";
import { getFromCache } from "./cache";

export class FetchClient {
    defaultOptions: FetchConfigType
    constructor(config?: FetchConfigType) {
        this.defaultOptions = {
            cacheTime: 60 * 1000, // 1 min
            refetchOnWindowFocus: true,
            ...config
        }
    }
    getQueryCacheData(key: string) {
        const { body } = getFromCache(key);
        if (body) {
            return JSON.parse(body)
        } return undefined
    }
    async refetchQueries(key: string) {
        const cacheEntry = getFromCache(key);
        if (cacheEntry) {
            const { queryFn, setState } = cacheEntry;

            // Set loading state to true
            setState((prevState) => ({ ...prevState, isLoading: true }));

            try {
                const result = await queryFn();
                const data = await result.json();

                if (!result.ok) {
                    throw result
                }

                // Set data and update loading/error states
                setState((prevState) => ({
                    ...prevState,
                    data,
                    isLoading: false,
                    isError: false,
                    error: null,
                }));
            } catch (err) {
                if (err instanceof Error) {
                    setState(prev => ({ ...prev, error: err.message, isError: true }))

                    return
                }
                const errRes = await err.json()
                setState(prev => ({ ...prev, error: errRes, isError: true }))
            } finally {
                setState((prevState) => ({
                    ...prevState,
                    isLoading: false,
                }));
            }
        }
    }
}