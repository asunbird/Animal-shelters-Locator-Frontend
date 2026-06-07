import { useState, useEffect, useRef } from 'react';

// perfectly paced cumulative thresholds
/*
const LEVEL_THRESHOLDS = [
  0,                   // Level 0: 0 min
  2 * 60 * 1000,       // Level 1: 2 min 
  4 * 60 * 1000,       // Level 2: 4 min (2+2)
  7 * 60 * 1000,       // Level 3: 7 min (4+3)
  10 * 60 * 1000,      // Level 4: 10 min (7+3)
  14 * 60 * 1000,      // Level 5: 14 min (10+4)
  20 * 60 * 1000,       // Level 6: 20 min (14+6)
];
*/

// level timer for testing
// Each level increments by 60000ms (1 minute), cumulative
const test_timer = [
    0,                  // Level 0: 0 min
  1 * 60 * 1000,       // Level 1: 1 min cumulative
  2 * 60 * 1000,       // Level 2: 2 min cumulative
  3 * 60 * 1000,       // Level 3: 3 min cumulative
  4 * 60 * 1000,       // Level 4: 4 min cumulative
  5 * 60 * 1000,       // Level 5: 5 min cumulative
  7 * 60 * 1000,       // Level 6: 7 min cumulative
];

// Total cycle time: 7 minutes (then resets)
const TOTAL_CYCLE_TIME = test_timer[test_timer.length - 1];

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

        // 3. Determine the current level with cycling
        // Use modulo to cycle through levels (resets after reaching max)
        const cycleTime = accumulatedTimeRef.current % TOTAL_CYCLE_TIME;
        
        let currentLevel = 0;
        for (let i = test_timer.length - 1; i >= 0; i--) {
          if (cycleTime >= test_timer[i]) {
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
