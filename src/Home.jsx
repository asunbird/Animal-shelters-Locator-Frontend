import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
// Import icons
import logoIcon from '/src/assets/Logo-PetMap.svg';
import gitHub from '/src/assets/GitHub.png';

// Import the Map Container for Leaflet



// Home component with header, main content, and footer
function Home() {
    // 1. Track what the user types
    const [searchInput, setSearchInput] = useState('');
  
    // 2. Initialize the navigate function
    const navigate = useNavigate();

    // 3. Create the onClick handler
    const handleSearchClick = () => {
        if (!searchInput.trim()) return; // Prevent searching if the input is empty
        // Navigate to the map page AND pass the search the search input in the background
        navigate('/map', { state: { requestedLocation: searchInput } }); 
    };

    return (
        <section id="home">
            <header>
                <div>
                    <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                </div>
                {/* Level Bage */}  
                <div id="level" className="level-badge">
                    <span>Level 1</span>
                    <div className="level-progress-bar">
                        <div className="progress-fill" style={{ width: '50%' }}></div>
                    </div>
                </div>
                {/* Language Switcher ES-EN */}
                <div id="lang" className="lang-switch-container">
                    <div id="lang-ES-btn" className="jost-700">ES</div>
                    <div className="lang-toggle-btn">
                        <div className="lang-toggle-point"></div>
                    </div>
                    <div id="lang-EN-btn" className=" jost-700">EN</div>
                </div>

                <nav className="nav-links jost-700"> 
                    {/* <Link className="nav-sections" to="/about">About</Link> */}
                    <Link id="autorisation" to="/signin">
                        Sign in
                    </Link>
                </nav>

                {/* Favorites buton */}
                <div className="fav-container flex-row">
                    <div id="favorites-btn">
                        <p id="favorites-count" className="icon-text libre-franklin-700">0</p>
                    </div>
                    <Link className="nav-sections libre-franklin-700" to="/favorites">Favorites</Link>
                </div> 
            </header>
            <main>
                <div className="home-content">
                    <h2 className="jost-700">FIND THE ANIMAL SHELTER NEAR YOU</h2>
                    <div className="search-bar-container">
                        {/* Updates a state when user types */}
                        <input
                            type="text"
                            placeholder="Enter a city or location"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            id="location-input"
                            className="search-input"
                            name="search"
                            required
                        />
                        {/* onClick event to Action Button */}
                        <button onClick={handleSearchClick} id="search-btn" 
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



export default Home;

