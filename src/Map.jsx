import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // <-- user's input Location
import { Link } from "react-router-dom";
// Import icons
import homeIcon from '/src/assets/icons/Home-icon.svg';
// Import the Map Container for Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import ShelterCard from './PoiContacts.jsx';

import { useSaveFavorites } from './hooks/saveFavorites';

// Fix for default marker icon in leaflet with bundler
import L from 'leaflet';
import pawIcon from './assets/point.svg';
import 'leaflet/dist/leaflet.css';
let DefaultIcon = L.icon({
    iconUrl: pawIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Rendering a Map
function Map() {

    // 1. Grab the router location
    const locationRouter = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const { favorites, toggleFavorite, isFavorite } = useSaveFavorites();
    const [hasSearched, setHasSearched] = useState(false);
    const [initialMapCenter, setInitialMapCenter] = useState([40.417840, -3.688085]);
    const [map, setMap] = useState(null); // Assuming save leaflet map instance here
    
    const [isSearching, setIsSearching] = useState(false);
  
    const [shelters, setShelters] = useState([]);
    const [isLoadingShelters, setIsLoadingShelters] = useState(false);

    const [viewMode, setViewMode] = useState('map'); // 'map' | 'list' | 'favorites'

    // 2. Add this effect to handle the incoming search from Home
    useEffect(() => {
        const query = locationRouter.state?.requestedLocation;
        
        // If we have a query AND the map has finished loading
        if (query && map) {
            setIsLoadingShelters(true);

            // Fetch coordinates for the city the user typed
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        // Extract latitude and longitude
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);

                        // Move the leaflet map to this new location
                        map.setView([lat, lon], 13);

                        // Now that the map is in the right place, trigger your shelter search!
                        // We use a tiny timeout to ensure the map has finished moving before fetching
                        setTimeout(() => {
                            fetchShelters();
                        }, 500); 
                    } else {
                        alert("Location not found on map.");
                        setIsLoadingShelters(false);
                    }
                })
                .catch(err => {
                    console.error("Geocoding error:", err);
                    setIsLoadingShelters(false);
                });
        }
    }, [locationRouter.state, map]); // Run this whenever the location state or map loads


 
    // Ensure map flies to search location if map wasn't ready during initial search
    useEffect(() => {
    if (map && hasSearched) {
            map.flyTo(initialMapCenter, 13);
        }
    }, [map, hasSearched, initialMapCenter]);
  


    const goToShelter = (shelter) => {
        const lat = shelter.lat || (shelter.center && shelter.center.lat);
        const lon = shelter.lon || (shelter.center && shelter.center.lon);
        let centerArr = [lat, lon];
        if (lat && lon) {
            setInitialMapCenter(centerArr);
            setHasSearched(true);
            setViewMode('map');
            // small timeout to ensure the map re-renders if key changes or center updates
            setTimeout(() => {
                if (map) {
                    map.flyTo(centerArr, 13);
                }
            }, 100);
        }
    };

    const handleZoomIn = () => {
        if (map) map.zoomIn();
    };

    const handleZoomOut = () => {
        if (map) map.zoomOut();
    };

    // Phase 1: Nominatim Geocoding
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`, {
                headers: { 'Accept-Language': 'en-US,en;q=0.9' }
            });
            const data = await resp.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const latNum = parseFloat(lat);
                const lonNum = parseFloat(lon);
        
                if (isNaN(latNum) || isNaN(lonNum)) {
                    alert("Could not determine coordinates for this location.");
                    return;
                }

                const centerArr = [latNum, lonNum];
                setInitialMapCenter(centerArr);
        
                if (map) {
                    map.flyTo(centerArr, 13);
                }
        
                // Always fetch shelters, even if map is not mounted yet
                fetchShelters(latNum, lonNum);
                setHasSearched(true);
                if (viewMode === 'favorites') {
                    setViewMode('map');
                }

            } else {
                alert("Location not found!");
            }

        } catch (err) {
            console.error(err);
            alert("Search failed.");
        } finally {
            setIsSearching(false);
        }
    };

    // Phase 2: Overpass QL Shelter Fetching
    const fetchShelters = async (lat, lon) => {
        if (lat === undefined || lon === undefined) {
            if (map) {
                const center = map.getCenter();
                lat = center.lat;
                lon = center.lng;
            } else {
                return;
            }
        }
        setIsLoadingShelters(true);

        let lastError = null;

        // Small 500ms delay between retries to give the next mirror a clean start
        if (lastError) await new Promise(resolve => setTimeout(resolve, 500));
      
        try {
            const radius = 50000; // 50km
            const overpassQuery = `
                [out:json][timeout:25];
                (
                    nwr["amenity"="animal_shelter"](around:${radius},${lat},${lon});
                    nwr["tourism"="animal_boarding"](around:${radius},${lat},${lon});
                    nwr["tourism"="animal_breeding"](around:${radius},${lat},${lon});
                    nwr["animal_shelter"](around:${radius},${lat},${lon});
                );
                out center tags;
            `;
            // nwr["amenity"="veterinary"](around:${radius},${lat},${lon});

            const response = await fetch("https://overpass-api.de/api/interpreter", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: `data=${encodeURIComponent(overpassQuery)}`
            });
            console.log(response);
            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }

            const data = await response.json();
            // Log full response and element count for every request
            console.log(data);
            console.log((data.elements || []).length);
            const elements = data.elements || [];
               
            if (elements.length === 0) {
                console.warn(`No shelters found near ${lat}, ${lon} within 30km`);
            }

            setShelters(elements);
            console.log("Shelters found:", elements.length);
            console.log(elements);

            setIsLoadingShelters(false);
            return; 

        } catch (err) {
            console.warn(`Mirror failed, trying next...:`, err.message);
            lastError = err;
        }
 

        setIsLoadingShelters(false);
        if (lastError) {
           console.log("All Overpass servers are currently struggling due to high traffic. Please try again in about 1 minute.");
        }
    };

    return (
        <section id="map-search">
            <header id="map-navigation">
                <div>
                    <div>
                        <Link className="home-btn" to="/">
                            <img className="icon" src={homeIcon} alt="Home" />
                            <p className="nav-sections">
                                Home
                            </p>
                        </Link>
                    </div>
                </div> 

                <form id="map-search-bar" className="search-bar-container" onSubmit={handleSearch}>
                    <input id="location-input" className="search-input"
                        type="text" 
                        placeholder="Search city (e.g. London)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button id="search-btn" className="search-button" 
                        type="submit" disabled={isSearching}>
                        {isSearching ? '...' : 'Go'}
                    </button>
                </form>

               
                <div className="fav-container flex-row">
                    <Link to="/favorites" id="favorites" style={{ textDecoration: 'none' }}> 
                        <p id="favorites-count" className="icon-text libre-franklin-700">
                            {favorites.length}
                        </p>
                    </Link>
                    <p className="libre-franklin-700">
                        Favorites
                    </p>
                </div> 

                <div className="round-container-vert">
                    <div id="map-switcher-zoom-plus" className="round-swith-btn">
                        <p className="jost-700">+</p>
                    </div>
                    <div id="map-switcher-zoom-minus" className="round-swith-btn">
                        <p className="jost-700">-</p>
                    </div>
                </div> 
            </header>
            
            <main id="map-main-content">
                <MapContainer id="leaflet-map" center={initialMapCenter} zoom={13} zoomControl={false} ref={setMap} >
                       <TileLayer
                  url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_MAPS_KEY || ''}`}
                  attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                />
                   

                 {/* Render overpass markers */}
                {shelters.map((shelter) => {
                  const tags = shelter.tags || {};
                  const name = tags.name || 'Unknown Shelter';
                  const website = tags['contact:website'] || tags.website;
                  const phone = tags['contact:phone'] || tags.phone;
                  const email = tags['contact:email'] || tags.email;
                  const openingHours = tags.opening_hours;
              
                  
                  // Extract address information if available
                  const street = tags['addr:street'];
                  const houseNum = tags['addr:housenumber'];
                  const city = tags['addr:city'];
                  const address = [houseNum, street, city].filter(Boolean).join(' ');
 
                  // Support both nodes (direct lat/lon) and ways/relations (center property)
                  const lat = shelter.lat || (shelter.center && shelter.center.lat);
                  const lon = shelter.lon || (shelter.center && shelter.center.lon);
 
                  if (!lat || !lon) return null;

                  return (
                    <Marker key={shelter.id} position={[lat, lon]} icon={DefaultIcon}>
                      <Popup>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div>
                            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>{name}</h3>
                          </div>
                            <button 
                                className={`heart-btn ${isFavorite(shelter.id) ? 'is-fav' : ''}`}
                                onClick={() => toggleFavorite(shelter)}
                                title={isFavorite(shelter.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              ❤️
                            </button>
                        </div>
                        {address && (
                          <p style={{ margin: '4px 0', color: '#666', fontSize: '0.9rem' }}>
                            {address}
                          </p>
                        )}
                        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
                        {website && (
                          <p style={{ margin: '4px 0' }}>
                            <strong>Website:</strong>{' '}
                            <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
                              {website}
                            </a>
                          </p>
                        )}
                        {phone && (
                          <p style={{ margin: '4px 0' }}>
                            <strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a>
                          </p>
                        )}
                        {email && (
                          <div style={{ margin: '4px 0' }}>
                            <strong>Email:</strong>{' '}
                            <form action={`mailto:${email}`} method="POST" encType="text/plain" style={{ display: 'inline' }}>
                              <button type="submit" className="email-link-btn">
                                {email}
                              </button>
                            </form>
                          </div>
                        )}
                        {openingHours && (
                          <p style={{ margin: '4px 0' }}>
                            <strong>Hours:</strong> {openingHours}
                          </p>
                        )}
                        <div style={{ margin: '8px 0', fontSize: '0.8rem', color: '#888', background: '#f9f9f9', padding: '8px', borderRadius: '4px' }}>
                          <strong style={{ display: 'block', marginBottom: '4px' }}>Coordinates: {lat.toFixed(5)}, {lon.toFixed(5)}</strong>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-accent)', fontWeight: 'bold', textDecoration: 'none' }}>
                              🚗 Google Maps
                            </a>
                            <a href={`https://maps.apple.com/?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', fontWeight: 'bold', textDecoration: 'none' }}>
                              🍎 Apple Maps
                            </a>
                          </div>
                        </div>

                        <div style={{ marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '8px', textAlign: 'center' }}>

                          <a 
                            href={`https://www.openstreetmap.org/${shelter.type}/${shelter.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.75rem', color: '#999', textDecoration: 'none' }}
                          >
                            ℹ️ View or Edit on OpenStreetMap
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                </MapContainer> 
                {/* Status Message for empty results */}
              {!isLoadingShelters && hasSearched && shelters.length === 0 && (
                <div className="status-message">
                  No shelters found in this area (30km radius)
                </div>
              )}
            {/* UI Overlay */}
            <section id="map" style={{ pointerEvents: 'none' }}>
                <div id="map-control" style={{ pointerEvents: 'auto' }}>
                    <button className="map-btn" onClick={handleZoomIn}>+</button>
                    <button className="map-btn" onClick={handleZoomOut}>-</button>
                    
                    {/* Search in this area button */}
                    <button 
                      className="map-btn search-area-btn"
                      onClick={() => fetchShelters()} 
                      disabled={isLoadingShelters}
                    >
                      {isLoadingShelters ? '...' : 'Search Area'}
                    </button>
                </div>
                <div className="items-grid">
                    {shelters.map(shelter => (
                    <ShelterCard 
                        key={shelter.id} 
                        shelter={shelter} 
                        isFavorite={isFavorite(shelter.id)}
                        onToggleFavorite={toggleFavorite}
                        onAction={goToShelter}
                    />
                ))}
              </div>
                <div id="map-close" style={{ pointerEvents: 'auto' }}>
                    <button className="map-btn" onClick={() => setHasSearched(false)}>x</button>
                </div>
            </section>
            </main>
        </section>
    )
}


export default Map;

