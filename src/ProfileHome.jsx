
import { Link, useNavigate } from "react-router-dom";
// Import icons
import logoIcon from '/src/assets/Logo-PetMap.svg';
import gitHub from '/src/assets/GitHub.png';
import { Outlet } from "react-router-dom";



// USER Profile-Home component with header, main content, and footer
export function ProfileHome() {
    const navigate = useNavigate();
    return (
        <section id="profile-home">
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
                    <Link id="profile-settings-link" to="profilesettings">
                        Profile Settings
                    </Link>
                    <Outlet/>
                    <Link className="nav-sections" to="/about">About</Link>
                </nav>
                <div className="fav-container flex-row">
                    <div id="favorites">
                        <p id="favorites-count" className="icon-text libre-franklin-700">0</p>
                    </div>
                    <p className="libre-franklin-700">Favorites</p>
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

export function ProfileSettings() {
    return (
        <section id="profile-settings">
            <div id="prof-settings-container">
                <form id="user-contacts" action="">
                    <div>Personal contacts data</div>
                    <input type="text" placeholder="Username" /><br/>
                    <input type="password" placeholder="Password" /><br/>
                    <button type="submit" id="submit-btn" >
                        Save Changes
                    </button><br/>
                    <input type="email" placeholder="Email Address" /><br/>
                    <button type="button">Reset Password</button>
                </form><br/>
                <div id="favorites-settings">
                    <div id="level-settings" className="libre-franklin-700">Favorites list Settings</div>
                    <button type="button">Share Favorites list</button>
                </div><br/>
                <div id="level-settings" className="libre-franklin-700">Level Settings</div><br/>
                 <button className="libre-franklin-700" type="button">
                    <Link to="/profilehome">Close X</Link>   
                </button>
            </div>
        </section>
    )
}

const ProfileElements =()=>{
}
export default ProfileElements;

