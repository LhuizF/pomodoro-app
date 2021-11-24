import { useEffect, useRef } from 'react';

export default function useInterval(
    callback: () => void,
    delay: number | null
): void {
    const saveCallback = useRef(callback);

    useEffect(() => {
        saveCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (saveCallback.current) saveCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
