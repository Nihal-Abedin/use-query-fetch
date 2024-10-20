# Custom React Query Hooks

This project provides custom React hooks, `useQuery` and `useMutation`, that simplify data fetching and mutation using the Fetch API. The main purpose of building these hooks is to integrate seamlessly with **React Query**, enhancing state management for server data.

## Key Features

- **Caching**: Automatically caches GET requests to reduce network load.
- **Refetch on Window Focus**: Detects when the browser tab is focused and refetches data, bypassing cached responses.
- **Error Handling**: Provides detailed error information when requests fail.
- **Custom Request Configurations**: Supports flexible configurations such as different HTTP methods, request bodies, and custom headers.
- **Callback Support**: Includes optional callbacks (e.g., `onSuccess`) that trigger when the data is successfully fetched.

## Features

- **`useQuery`**: Fetches data from an API endpoint and handles success and error scenarios with optional callbacks.
- **`useMutation`**: Performs data modifications manages the request's state and responses.
- **`Configurable`**: Allows for flexible configuration, including cache time and refetching on window focus.

## Usage

## Fetch config & Fetch Client

## Fetch Config

- This fetchConfig object is a configuration object that controls two key behaviors for fetching data: refetching on window focus and caching time.
- Here's a breakdown of how it's types:

  ```typescript
  type FetchConfigType = {
    refetchOnWindowFocus?: boolean; // default false
    cacheTime?: number; // default 1 minute
  };
  ```

  - **`refetchOnWindowFocus`**: A boolean option that determines whether the data should be refetched when the browser window gains focus again. If set to true, the app will refetch the data every time the user switches back to the browser tab (similar to React Query's refetchOnWindowFocus behavior).

  - **`cacheTime`**: A number (in milliseconds) that defines how long the fetched data will be cached before it becomes stale and needs to be refetched. In this case, it's set to 60 \* 1000, which is 60 seconds (or 1 minute). You can modify this time to control how long data should remain cached.

## Fetch Client

- The FetchClient class provides a robust framework for handling data fetching and caching in a React application. It simplifies the process of managing cache, and refetching queries, ensuring that your application's data stays fresh and consistent.
  - `getQueryCacheData` - Takes a key as params and gets the ached data corresponding to the **key**.
  - `refetchQueries` - Takes a key as params and refetched any query that matches to **key**. Very usefull when any data is mutate and requies latest data to be shown!

## Basic Usage Example

## Consume `FetchWrapper`

- **Here's how to consume the FetchWrapper :**

  ```javascript
      import { FetchClient } from "use-query-fetch";

      export const client = new FetchClient({
          refetchOnWindowFocus: true,
      });
      const App = () => {
          return  <FetchWrapper client={client.defaultOptions}>
          {...}
        </FetchWrapper>
      };
  ```

  - As the `client` equipped with the Parent methods, later we can use it for other cases with the same configeration so export it can be usefull.

## `useQuery`

- **Here's how to use the useQuery hook to fetch data:**

```javascript
import { useQuery } from "use-query-fetch";

const MyComponent = () => {
  const { data, isLoading, isError, error } = useQuery<
  //expected Response TYPES
   {message:string;reults:number}>({
        queryKey: 'your-key', // `Every key should be unique so that every cached data has their own identifier and can be used later`
        queryFn: asyn()=>{
            // must be an ASYNC funtion
            // Your api call here
        }
    },{
        onSuccess: (data) => console.log("Data loaded successfully:", data), // Fires when success
        // data will get the type defination you pass above.
        onError: (error) => console.error("Error posting data:", error), // Fires when error occurs
    })

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error occurred.</p>;

  return <div>{JSON.stringify(data)}</div>;
};
```

## `useMutation`

- **To modify data, you can use the useMutation hook:**

```javascript
import { useMutation } from "use-query-fetch";

const MyComponent = () => {
  const { data, isLoading, isError, error, mutate } = useMutation<
  //expected Payload TYPES
  {title:string}
  >({
        queryFn: asyn()=>{
            // must be an ASYNC funtion
            // Your api call here
        }
    })

  const handleSubmit = () => {
    const payload = {
      /* your data */
    };
    mutate(payload,{
            onError(error) {
              console.error(error); // Fires when error occurs
            },
            onSuccess(data) {
              console.log(data); // Fires when success
            },
          }); // make sure that the payload remains as same expected type
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

## Fetch Client (Contd.)

- **As now Fetch Client has the capacity to get some cached data and refetch api based onto `key`. Some updates can be done with this and more yet to come**

  1. **`Refetch Queries:`** If client finds any cached data corresponding to that key. It re-fetches that exact query for the exact key.

  ```javascript
  // here the exported client come in handy!
  client.refetchQueries("keys");
  // or
  // also can be called inside some callbacks
  mutate(
    { title: "Hi" },
    {
      onSuccess() {
        client.refetchQueries("keys"); // unique keys & makes sure that the latest data is fetched after mutating. :D
      },
    }
  );
  ```

  2. Suppose You want a Sepecific query to cached for a specific time other than all the remain queries & want to reftch it every time when the window is focused

  ```javascript
    const {defaultOptions} = new FetchClient({
            cacheTime:60*60*1000,
            refetchOnWindowFocus:true
    });
    useQuery<
      //expected Response TYPES
       {message:string;reults:number}>({
            queryKey: 'your-key',
            queryFn: asyn()=>{
            },
            config: {
                ...defaultOptions
            }

        })
  ```

**Thank you <3**.
