import { useState } from 'react';
import { Link } from "react-router-dom";
import logoIcon from '/src/assets/LOGO-icon.svg';



function About () {
    const [count, setCount] = useState(0)
    return (
        <section id="about">
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
                        
            
                <button type="button" className="counter" onClick={() => setCount((count) => count + 1)} >
                    Count is {count}
                </button>
            
                <div>About us</div>
            
            </main>
            
            <footer></footer>

        </section>
    )
}

export default About