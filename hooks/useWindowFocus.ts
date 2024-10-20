import { useState, useEffect } from 'react';

/**
 * Custom hook to detect whether the window/tab is currently focused.
 *
 * @returns {boolean} Returns `true` if the window is focused, otherwise `false`.
 *
 * This hook listens to the `visibilitychange` event and updates the state 
 * based on whether the document is visible or hidden.
 */
export const useWindowFocus = (): boolean => {
    const [isWindowFocused, setIsWindowFocused] = useState(false);

    useEffect(() => {
        // const handleFocus = () => {
        //   setIsWindowFocused(true);
        // };

        // const handleBlur = () => {
        //   setIsWindowFocused(false);
        // };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setIsWindowFocused(true);  // Tab became visible again
            } else {
                setIsWindowFocused(false); // Tab is now hidden
            }
        };

        // window.addEventListener('focus', handleFocus);
        // window.addEventListener('blur', handleBlur);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            //   window.removeEventListener('focus', handleFocus);
            //   window.removeEventListener('blur', handleBlur);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return isWindowFocused;
};
