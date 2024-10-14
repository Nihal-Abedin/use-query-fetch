import { useEffect, useState } from "react";
import { useFetch } from "./useFetch";
import { authFetch } from "./authFetch";
import { fetchConfig, FetchConfigType } from "../utils/fetchConfig";


type CallbackOptions = {
    onSuccess?: (data: unknown) => void;
    onError?: (error: unknown) => void;
    BASE_URL?: string
}
export const useQuery = (
    path: string,
    options?: CallbackOptions & FetchConfigType
) => {
    const { data, error, isError, isLoading } = useFetch(path, { method: "GET", BASE_URL: options.BASE_URL, ...fetchConfig });
    useEffect(() => {
        if (options?.onSuccess && data) {
            options.onSuccess(data);
        }
        if (options?.onError && error) {
            options.onError(error);
        }
    }, [data, error, options]);
    return { data, error, isError, isLoading };
};
export const useMutation = (
    path: string,
    options?: {
        method?: "POST" | "PATCH" | "PUT" | "DELETE";
        BASE_URL?: string;
    }
) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const doMutation = async (payload, callbacks?: CallbackOptions) => {
        setIsLoading(true);
        try {
            const res = await authFetch(path, { body: payload, method: "POST", ...options });
            if (!res.ok) {
                throw res;
            }
            const resData = await res.json();
            setData(resData);
            callbacks?.onSuccess(resData)
        } catch (err) {
            const errRes = await err.json();
            setError(errRes);
            setIsError(true);
            callbacks.onError(errRes)
        } finally {
            setIsLoading(false);
        }
    };
    return {
        mutate: doMutation,
        error,
        data,
        isLoading,
        isError,
    };
};
