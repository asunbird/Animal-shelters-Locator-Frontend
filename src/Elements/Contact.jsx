import { Link } from "react-router-dom";
import logoIcon from '/src/assets/LOGO-icon.svg';

function Contact () {

    return (
        <section id="contact">

            <header>
               <div className="logo">
                    <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                    pet map
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
                        <Link className="nav-sections" to="/">Home</Link>
                        <Link className="nav-sections" to="/about">About</Link>
                        <Link className="nav-sections" to="/contact">Contact</Link>
                        <Link className="autorisation" to="/signin">Sign in</Link>
                </nav>
                
            </header>

            <main>
                <div>Contact Support</div>
            
            </main>
            
            <footer className="libre-franklin-700">
                © 2026 Pet Map | 
                <a href="https://github.com/asunbird/Animal-shelters-Locator-Frontend" target="_blank" >
                    GitHub
                </a>
            </footer>
            
        </section>
    )
}

export default Contact

