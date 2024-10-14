// import { getRefreshToken, isAccessTokenExpired } from "./authHelpers";
// // const BASE_URL = 'https://stagingpropertyvaluation.propcloud.no/api/core/auth/v1'
// const setNewToken = async (token: string) => {
//     const user = JSON.parse(localStorage.getItem('user'));
//     user.token = token;
//     localStorage.setItem('user', JSON.stringify(user));
// }
const BASE_URL = process.env.BASE_URL

export const authFetch = async (
    url: string,
    options: {
        method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
        body?: string | FormData;
        headers?: HeadersInit;
        BASE_URL?: string;
        OTHER_BASE_URL?: string;
    } = {}
) => {
    // options.BASE_URL = "https://natours-sable-three.vercel.app/api/v1";
    const accessToken = JSON.parse(`${localStorage.getItem("user")}`)?.token || 'sad';
    if (!accessToken) {
        // goto('/')
        return;
    }
    // Set default headers
    options.headers = {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        ...options.headers,
    };
    if (!(options.body instanceof FormData)) {
        options.headers["Content-Type"] = "application/json";
    }
    const reqOptions = {
        method: options.method || "GET",
        headers: options.headers,
        body: options.body,
    };
    // Check if the access token is expired
    // if (await isAccessTokenExpired(accessToken)) {
    //     const res = await getRefreshToken();

    //     setNewToken(res.newAccessToken)

    //     // Update the Authorization header with the new token
    //     options.headers['Authorization'] = `Bearer ${res.newAccessToken}`;
    // }

    // Make the fetch request
    const response = await fetch(
        `${options.OTHER_BASE_URL ? options.OTHER_BASE_URL : options.BASE_URL ? options.BASE_URL : BASE_URL
        }/${url}`,
        reqOptions
    );
    // if ((response.status === 401 || response.status === 410)) {
    //     const refresReq = await getRefreshToken();
    //     options.headers['Authorization'] = `Bearer ${refresReq.newAccessToken}`;
    //     setNewToken(refresReq.newAccessToken)
    //     response = await fetch(`${options.OTHER_BASE_URL ? options.OTHER_BASE_URL : options.BASE_URL}/${url}`, reqOptions);
    // }
    if (!response.ok) {
        throw response;
    }

    return response; // Return the response data
};
