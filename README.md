# Custom React Query Hooks `v-1.0.1`

This project provides custom React hooks, `useQuery` and `useMutation`, that simplify data fetching and mutation using the Fetch API. The main purpose of building these hooks is to integrate seamlessly with **React Query**, enhancing state management for server data.

## Key Features

- **Caching**: Automatically caches GET requests to reduce network load.
- **Refetch on Window Focus**: Detects when the browser tab is focused and refetches data, bypassing cached responses.
- **Error Handling**: Provides detailed error information when requests fail.
- **Custom Request Configurations**: Supports flexible configurations such as different HTTP methods, request bodies, and custom headers.
- **Callback Support**: Includes optional callbacks (e.g., `onSuccess`) that trigger when the data is successfully fetched.

## Features

- **`useQuery`**: Fetches data from an API endpoint and handles success and error scenarios with optional callbacks.
- **`useMutation`**: Performs data modifications (POST, PATCH, etc.) and manages the request's state and responses.
- **Configurable**: Allows for flexible configuration, including cache time and refetching on window focus.
- **Auth Request**: Allows Authentication request for any for any routes by default! `In case of AUTHORIZATION Please set your Set Your token to Local storage as name **`token`** `

## Usage

## Fetch config

- **This fetchConfig object is a configuration object that controls two key behaviors for fetching data: refetching on window focus and caching time**.
- **Here's a breakdown of how it works:**

```typescript
export type FetchConfigType = {
  refetchOnWindowFocus?: boolean;
  cacheTime?: number;
};
```

- **refetchOnWindowFocus: A boolean option that determines whether the data should be refetched when the browser window gains focus again. If set to true, the app will refetch the data every time the user switches back to the browser tab (similar to React Query's refetchOnWindowFocus behavior).**

- **cacheTime: A number (in milliseconds) that defines how long the fetched data will be cached before it becomes stale and needs to be refetched. In this case, it's set to 60 \* 1000, which is 60 seconds (or 1 minute). You can modify this time to control how long data should remain cached.**

```typescript
export const fetchConfig: FetchConfigType = {
  refetchOnWindowFocus: true, // Enable refetching when window gains focus
  cacheTime: 60 * 1000, // Cache data for 1 minute (60,000 milliseconds)
};
```

- **refetchOnWindowFocus: true: This means that the application will automatically refetch the data when the window gains focus. This is useful in situations where you want to ensure that your data is fresh if the user returns to the app after being away.**

- **cacheTime: 60 \* 1000: This sets the caching time to 1 minute. Data will be cached for 60 seconds, after which it will become stale and a new fetch request will be made.**

```typescript

This configuration can be passed to a custom fetch hook or used directly with a data-fetching library like React Query to fine-tune refetching and caching behavior. Here’s an example of how you might use it:

const { data, error } = useFetch('/api/data', {
    ...fetchConfig // apply the configuration to your fetch hook
});

This setup mimics the behavior of React Query's refetchOnWindowFocus and staleTime options.
```

## Basic Usage Example

## `useQuery`

- **Here's how to use the useQuery hook to fetch data:**

```javascript
import { useQuery } from "./path/to/useQuery";

const MyComponent = () => {
  const { data, isLoading, isError } = useQuery("/your-api-endpoint", {
    onSuccess: (data) => console.log("Data fetched successfully:", data),
    onError: (error) => console.error("Error fetching data:", error),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error occurred.</p>;

  return <div>{JSON.stringify(data)}</div>;
};
```

## `useMutation`

- **To modify data, you can use the useMutation hook:**

```javascript
import { useMutation } from "./path/to/useMutation";

const MyComponent = () => {
  const { mutate, isLoading, isError, error } = useMutation(
    "/your-api-endpoint",
    {
      method: "POST",
      onSuccess: (data) => console.log("Data posted successfully:", data),
      onError: (error) => console.error("Error posting data:", error),
    }
  );

  const handleSubmit = () => {
    const payload = {
      /* your data */
    };
    mutate(payload);
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit Data</button>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error occurred: {JSON.stringify(error)}</p>}
    </div>
  );
};
```
## Query Options

## BASE_URL `Usage`
- **Both useQuery and useMutation hooks accept an optional BASE_URL parameter. This allows you to specify a base URL for your API calls, making it easier to manage multiple endpoints without repeating the base URL in each request.**

  ## **`You can use the BASE_URL for:`**


  1. **`Multiple Services:`** If you have multiple API services (e.g., authentication, data fetching, etc.), you can set different base URLs for each service. This allows you to keep your requests organized and clear.

  2. **`Single Service:`** If your application communicates with a single API service, you can set the base URL once and simplify all your API requests.
  For example, if your API is hosted at https://your-api-base-url.com, you can set it as follows:


  ```javascript
  BASE_URL: 'https://your-api-base-url.com'
  ```
  This URL will be automatically prepended to the path argument you pass to the hooks.