
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
// Import icons
import logoIcon from '/src/assets/Logo-PetMap.svg';
import gitHub from '/src/assets/GitHub.png';
import homeIcon from '/src/assets/icons/Home-icon.svg';
// Import the Map Container for Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
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



// Home component with header, main content, and footer
export function Home() {
    const navigate = useNavigate();

    return (
        <section id="home">
            <header>
                <div>
                    <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                </div>  
                <div className="level-badge">
                    <span>Level 1</span>
                    <div className="level-progress-bar">
                        <div className="progress-fill" style={{ width: '50%' }}></div>
                    </div>
                </div>
                <div className="lang-switch-container">
                    <div id="lang-ES-btn" className=" jost-700">ES</div>
                    <div className="lang-toggle-btn">
                        <div className="lang-toggle-point"></div>
                    </div>
                    <div id="lang-EN-btn" className=" jost-700">EN</div>
                </div>
                <nav className="nav-links jost-700"> 
                    <Link id="autorisation" to="/signin">
                        Sign in
                    </Link>
                    <Link className="nav-sections" to="/about">About</Link>
                </nav>
                <div className="fav-container flex-row">
                    <div id="favorites">
                        <p id="favorites-count" className="icon-text libre-franklin-700">0</p>
                    </div>
                    <Link className="nav-sections libre-franklin-700" to="/favorites">Favorites</Link>
                </div> 
            </header>
            <main>
                <div className="home-content">
                    <h2 className="jost-700">FIND THE ANIMAL SHELTER NEAR YOU</h2>
                    <div className="search-bar-container">
                        <input
                            id="location-input"
                            className="search-input"
                            type="text"
                            placeholder="Enter your city" 
                            name="search"
                            required
                        />
                        <button onClick={()=> navigate("map")} id="search-btn" 
                            className="search-button" type="button" >
                            Search
                        </button>
                    </div>
                </div>
            </main>
            <footer className="libre-franklin-700">
                © 2026 Pet Map |
                <img className="github" src={gitHub} alt="GitHub" />
                <a href="https://github.com/asunbird/Animal-shelters-Locator-Frontend" target="_blank" >
                    GitHub
                </a>
            </footer>
        </section>
    );
}


// Rendering a Map
export function Map() {

const [hasSearched, setHasSearched] = useState(false);
  const [initialMapCenter, setInitialMapCenter] = useState([40.417840, -3.688085]);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [shelters, setShelters] = useState([]);
  const [isLoadingShelters, setIsLoadingShelters] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list' | 'favorites'

      const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('paws_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const toggleFavorite = (shelter) => {


    setFavorites(prev => {
      const isFav = prev.some(f => f.id === shelter.id);
      if (isFav) {
        return prev.filter(f => f.id !== shelter.id);
      } else {
        return [...prev, shelter];
      }
    });
  };

  const isFavorite = (shelterId) => favorites.some(f => f.id === shelterId);

const goToShelter = (shelter) => {
    const lat = shelter.lat || (shelter.center && shelter.center.lat);
    const lon = shelter.lon || (shelter.center && shelter.center.lon);
    if (lat && lon) {
      setInitialMapCenter([lat, lon]);
      setHasSearched(true);
      setViewMode('map');
      // We set a small timeout to ensure the map re-renders if key changes or center updates
      setTimeout(() => {
        if (map) {
          map.flyTo([lat, lon], 15);
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

       // Use local serverless proxy to avoid CORS (Vercel: /api/overpass)
    const mirrors = [
      '/api/overpass'
    ];

    let lastError = null;

    for (const url of mirrors) {
      // Small 500ms delay between retries to give the next mirror a clean start
      if (lastError) await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const radius = 30000; // 30km
        const overpassQuery = `
          [out:json][timeout:25];
          nwr["amenity"="animal_shelter"](around:${radius},${lat},${lon});
          out center;
        `;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: `data=${encodeURIComponent(overpassQuery)}`
        });

        if (!response.ok) {
                     throw new Error(`Status ${response.status}`);
        }

        const data = await response.json();
        const elements = data.elements || [];
               
        if (elements.length === 0) {
           console.warn(`No shelters found near ${lat}, ${lon} within 30km`);
        }

        setShelters(elements);
        setIsLoadingShelters(false);
        return; 

      } catch (err) {
        console.warn(`Mirror ${url} failed, trying next...:`, err.message);
        lastError = err;
      }
    }

    setIsLoadingShelters(false);
    if (lastError) {
      alert("All Overpass servers are currently struggling due to high traffic. Please try again in about 1 minute.");
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

                <div className="flex-row margin-h-20">
                    <span id="map-switcher-map" className="libre-franklin-700 float-right">
                        MAP
                    </span>
                    <div className="round-container">
                        <div id="map-switcher" className="round-swith-btn float-right"></div>
                    </div>
                    <span id="map-switcher-list" className="libre-franklin-700 float-right">
                        LIST
                    </span>
                </div> 
                <div className="fav-container flex-row">
                    <div id="favorites">
                        <p id="favorites-count" className="icon-text libre-franklin-700">
                            0
                        </p>
                    </div>
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
                <MapContainer id="leaflet-map" center={initialMapCenter} zoom={15} zoomControl={false} ref={setMap} >
                       <TileLayer
                  url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_MAPS_KEY || ''}`}
                  attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>

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
                          <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '1.1rem' }}>{name}</h3>
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
                          <p style={{ margin: '4px 0' }}>
                            <strong>Email:</strong>{' '}
                            <form action={`mailto:${email}`} method="POST" encType="text/plain" style={{ display: 'inline' }}>
                              <button type="submit" className="email-link-btn">
                                {email}
                              </button>
                            </form>
                          </p>
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

function ShelterCard({ shelter, isFavorite, onToggleFavorite, onAction }) {
  const tags = shelter.tags || {};
  const name = tags.name || 'Unknown Shelter';
  const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean).join(' ') || 'No address provided';
  const website = tags['contact:website'] || tags.website;
  const phone = tags['contact:phone'] || tags.phone;
  const email = tags['contact:email'] || tags.email;
  const lat = shelter.lat || (shelter.center && shelter.center.lat);
  const lon = shelter.lon || (shelter.center && shelter.center.lon);

  return (
    <div className="shelter-card">
      <div className="card-header">
        <h3>{name}</h3>
        <button 
          className={`heart-btn ${isFavorite ? 'is-fav' : ''}`} 
          onClick={() => onToggleFavorite(shelter)}
        >
          ❤️
        </button>
      </div>
      <p className="card-address">
        {address}
      </p>
      
      <div className="card-contacts">
        { website && (
          <div className="contact-item">
            <strong>Website:</strong>{' '}
            <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </div>
        )}
        { phone && (
          <div className="contact-item">
            <strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a>
          </div>
        )}
        { email && (
          <div className="contact-item">
            <strong>Email:</strong>{' '}
            <form action={`mailto:${email}`} method="POST" encType="text/plain" style={{ display: 'inline' }}>
              <button type="submit" className="email-link-btn">
                {email}
              </button>
            </form>
          </div>
        )}
        {tags.opening_hours && (
          <div className="contact-item">
            <strong>Hours:</strong> {tags.opening_hours}
          </div>
        )}
        <div className="contact-item location-data" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #eee', fontSize: '0.8rem', color: '#888' }}>
          <strong>Location:</strong> {lat?.toFixed(5)}, {lon?.toFixed(5)}
          <div style={{ marginTop: '4px', display: 'flex', gap: '10px' }}>
            <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-accent)', textDecoration: 'none', fontWeight: 'bold' }}>
              📍 Google Maps
            </a>
            <a href={`https://maps.apple.com/?q=${lat},${lon}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF', textDecoration: 'none', fontWeight: 'bold' }}>
              🍎 Apple Maps
            </a>
          </div>
        </div>
      </div>



      <div className="card-actions">

        <button className="view-on-map-btn" onClick={() => onAction(shelter)}>
          View on Map
        </button>
      </div>
    </div>
  );
}



const HomeContent =()=>{
}

export default HomeContent;

