
import { Link } from "react-router-dom";
import logoIcon from '/src/assets/Logo-PetMap.svg';
import { Outlet } from "react-router-dom";
// Outlet is for shouwing nested pages data. If we clicj Info or Address, the Outlet will display data from them.

// Home component with header, main content, and footer
export function Home() {

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
                    <Link className="autorisation" to="signin">Sign in</Link>
                    <Outlet/>
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
                        <button
                            id="search-btn"
                            className="search-button"
                            type="button" 
                            >
                            Search
                        </button>
                    </div>
                </div>

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

export function SignIn() {
    return (
        <section id="sign-in">
            <div>Sign in</div>
            <form id="sign-in-form" action="" method="">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Submit</button>
                <div>Don't Remember Your Password?</div>
                <input type="email" placeholder="Email Address" />
                <button type="button">Reset Password</button>
            </form>
            <div>Or Create an Account</div>
            <form id="create-account-form" action="" method="">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Create</button>
            </form>
            <div>
                <Link className="nav-sections" to="/">Home</Link>
            </div>
        </section>
    )
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

