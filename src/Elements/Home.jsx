
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import logoIcon from '/src/assets/Logo-PetMap.svg';

const DEFAULT_CENTER = [40.7128, -74.0060];

function Home () {
    const [query, setQuery] = useState('');
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [locationName, setLocationName] = useState('New York City');
    const [showMap, setShowMap] = useState(false);
    const [status, setStatus] = useState('');

    function resetHomeView() {
        setQuery('');
        setMapCenter(DEFAULT_CENTER);
        setLocationName('New York City');
        setShowMap(false);
        setStatus('');
    }

    async function handleSearch() {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            setStatus('Please enter a city name.');
            return;
        }

        setStatus('Searching...');

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedQuery)}`
            );
            const results = await response.json();

            if (results.length === 0) {
                setStatus('City not found. Try another search.');
                setShowMap(false);
                return;
            }

            const { lat, lon, display_name } = results[0];
            setMapCenter([parseFloat(lat), parseFloat(lon)]);
            setLocationName(display_name);
            setShowMap(true);
            setStatus('');
        } catch (error) {
            console.error(error);
            setStatus('Unable to load map. Please try again.');
            setShowMap(false);
        }
    }

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
                    <div className="lang-ES-btn jost-700">ES</div>
                    <div className="lang-toggle-btn">
                        <div className="lang-toggle-point"></div>
                    </div>
                    <div className="lang-EN-btn jost-700">EN</div>
                </div>

                <nav className="nav-links jost-700">
                        <Link className="nav-sections" to="/" onClick={resetHomeView}>Home</Link>
                        <Link className="nav-sections" to="/about">About</Link>
                        <Link className="nav-sections" to="/contact">Contact</Link>
                        <Link className="autorisation" to="/signin">Sign in</Link>
                </nav>
            </header>

            <main>
                <div className="home-content">
                    <h2 className="jost-700">FIND THE ANIMAL SHELTER NEAR YOU</h2>
                    <div className="search-bar-container">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Enter your city"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <button
                            id="search-btn"
                            className="search-button"
                            type="button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                    {status && <div className="search-status">{status}</div>}
                </div>

                <section id="map-container">
                    {showMap ? (
                        <>
                            <div className="map-result-label">Showing results for: {locationName}</div>
                            <MapContainer center={mapCenter} zoom={12} scrollWheelZoom style={{ width: '100%', height: '450px' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Circle center={mapCenter} radius={600} pathOptions={{ color: '#1e90ff', fillColor: '#1e90ff', fillOpacity: 0.2 }} />
                            </MapContainer>
                        </>
                    ) : (
                        <div className="map-placeholder">
                            Enter a city and click Search to render the map here.
                        </div>
                    )}
                </section>
            </main>

            <footer className="libre-franklin-700">
                © 2026 Pet Map | 
                <a href="https://github.com/asunbird/Animal-shelters-Locator-Frontend" target="_blank" >
                    GitHub
                </a>
            </footer>
            
        </section>
    );
}

export default Home