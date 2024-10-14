/**
 * catchAsync
 * 
 * A higher-order function that wraps an asynchronous function and handles errors for fetch requests.
 * If the function throws an error, it catches it and returns either the data or the error response.
 * 
 * @template P - The parameter type of the asynchronous function.
 * @template E - The type of the error response.
 * @param fn - An asynchronous function to be wrapped, which takes parameters and returns a promise.
 * @returns A function that accepts parameters and executes `fn`, catching any errors and returning either the result or the fetch error response.
 */
export const catchAsync = <P, E = any>(
    fn: (payload: P) => Promise<Response>
): (payload?: P) => Promise<{ data: any | null; error: E | null }> => {
    return async (payload: P) => {
        try {
            const response = await fn(payload);

            // Check if the response is not OK (HTTP status is not in the range of 2xx)
            if (!response.ok) {
                const errorData = await response.json();
                return {
                    data: null,
                    error: {
                        status: response.status,
                        statusText: response.statusText,
                        errorData,
                    } as E,
                };
            }

            const data = await response.json();
            return { data, error: null };
        } catch (err: unknown) {
            return {
                data: null,
                error: err as E, // Return the caught error
            };
        }
    };
};
