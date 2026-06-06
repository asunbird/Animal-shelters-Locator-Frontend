
import { Link, useNavigate } from "react-router-dom";
// Import icons
import logoIcon from '/src/assets/Logo-PetMap.svg';
import gitHub from '/src/assets/GitHub.png';
import homeIcon from '/src/assets/icons/Home-icon.svg';



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
                    <Link className="autorisation" to="/signin">
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



export function Map() {
      return (
        <section id="map-search" className="leaflet-container">
            <header>
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
                <div className="search-bar-container">
                    <input id="location-input" className="search-input" type="text"
                        placeholder="Enter your city" name="search" required />
                    <button 
                        id="search-btn" className="search-button" type="button" >
                        Search
                    </button>
                </div> 
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
            </header>
            <main>
                <div className="hero">
                    <div className="round-container-vert">
                        <div id="map-switcher-zoom-plus" className="round-swith-btn">
                            <p className="jost-700">+</p>
                        </div>
                        <div id="map-switcher-zoom-minus" className="round-swith-btn">
                            <p className="jost-700">-</p>
                        </div>
                    </div> 
                </div>   
            </main>
        </section>
    )
}

const HomeContent =()=>{
}

export default HomeContent;

