import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to handle incoming search requests from the Home page
 * Performs geocoding and fetches shelters when a location is requested
 * @param {Object} map - Leaflet map instance
 * @param {Function} setIsLoadingShelters - State setter for loading status
 * @param {Function} fetchShelters - Function to fetch shelters from Overpass API
 */
export const useLocationSearch = (map, setIsLoadingShelters, fetchShelters) => {
    const locationRouter = useLocation();

    useEffect(() => {
        const query = locationRouter.state?.requestedLocation;
        
        // If we have a query AND the map has finished loading
        if (query && map) {
            
            // 1. Create an async helper function
            const performGeocodingSearch = async () => {
                // Now this is safe from the linter warning!
                setIsLoadingShelters(true); 

                try {
                    // We can use await instead of .then() to make it cleaner!
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
                    const data = await res.json();

                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);

                        map.setView([lat, lon], 13);

                        setTimeout(() => {
                            fetchShelters();
                        }, 500); 
                    } else {
                        alert("Location not found on map.");
                        setIsLoadingShelters(false);
                    }
                } catch (err) {
                    console.error("Geocoding error:", err);
                    setIsLoadingShelters(false);
                }
            };

            // 2. Execute the helper function we just created
            performGeocodingSearch();
        }
    }, [locationRouter.state, map, setIsLoadingShelters, fetchShelters]);
};
