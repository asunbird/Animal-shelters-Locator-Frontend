
import { Link, useNavigate } from "react-router-dom";
import logoIcon from '/src/assets/Logo-PetMap.svg';
import gitHub from '/src/assets/GitHub.png';

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
                    <div className="lang-ES-btn jost-700">ES</div>
                    <div className="lang-toggle-btn">
                        <div className="lang-toggle-point"></div>
                    </div>
                    <div className="lang-EN-btn jost-700">EN</div>
                </div>

                <nav className="nav-links jost-700">  
                    <Link className="nav-sections" to="/about">About</Link>
                    <Link className="nav-sections" to="/contact">Contact</Link>
                    <Link className="autorisation" to="/signin">
                        Sign in
                    </Link>
                </nav>
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
                        <button onClick={()=> navigate("map")} id="search-btn" className="search-button" type="button" >
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
        <section id="map-search">
            <div>Map Search</div>

            <div>
                <Link className="nav-sections" to="/">Home</Link>
            </div>

        </section>
    )
}

const HomeContent =()=>{

}

export default HomeContent;

