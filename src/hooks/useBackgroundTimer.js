import { useState, useEffect, useRef } from 'react';

// perfectly paced cumulative thresholds
const LEVEL_THRESHOLDS = [
  0,                   // Level 0: 0 min
  2 * 60 * 1000,       // Level 1: 2 min 
  4 * 60 * 1000,       // Level 2: 4 min (2+2)
  7 * 60 * 1000,       // Level 3: 7 min (4+3)
  10 * 60 * 1000,      // Level 4: 10 min (7+3)
  14 * 60 * 1000,      // Level 5: 14 min (10+4)
  20 * 60 * 1000,       // Level 6: 20 min (14+6)
];


export const useBackgroundTimer = () => {
  const [level, setLevel] = useState(0);

  // useRef keeps track of mutable values without triggering re-renders
  const accumulatedTimeRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    // 1. Initialize from localStorage on mount
    accumulatedTimeRef.current = Number(localStorage.getItem("totalTimeSpent")) || 0;
    lastTickRef.current = Date.now();

    let timeoutId;

    const tick = () => {
      const now = Date.now();
      const delta = now - lastTickRef.current;  // Time passed since last check

      lastTickRef.current = now;

      // 2. Only add time if the user is actively viewing the tab
      if (!document.hidden) {
        accumulatedTimeRef.current += delta;
        localStorage.setItem("totalTimeSpent", accumulatedTimeRef.current.toString());

        // 3. Determine the current level
        let currentLevel = 0;
        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
          if (accumulatedTimeRef.current >= LEVEL_THRESHOLDS[i]) {
            currentLevel = i;
            break;
          }
        }

         // Update state (React batches this, so it only re-renders if level changes)
         setLevel(currentLevel);
      }

      // Check again in 1 second
      timeoutId = setTimeout(tick, 1000); 
    };

    tick();

    // 4. Handle edge cases when the user switches tabs and comes back
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // When they return, reset the clock so we don't count the time they were gone
        lastTickRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return level;
};
