import { useState, useEffect } from 'react';

export const useWindowFocus = () => {
    const [isWindowFocused, setIsWindowFocused] = useState(true);

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
