import { useState } from 'react';
import { Link } from "react-router-dom";
import logoIcon from '/src/assets/LOGO-icon.svg';
import mapImage from '/src/assets/MAP-pic.png';


function Home () {
       const [count, setCount] = useState(0)
    return (
        <section id="center">
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
                    <div className="lang-ES-btn">ES</div>
                    <div className="lang-toggle-btn">
                        <div className="lang-toggle-point"></div>
                    </div>
                    <div className="lang-EN-btn">EN</div>
                </div>

                <nav className="nav-links">
                        <Link className="nav-sections" to="/">Home</Link>
                        <Link className="nav-sections" to="/about">About</Link>
                        <Link className="nav-sections" to="/contact">Contact</Link>
                        <Link className="autorisation" to="/signin">Sign in</Link>
                </nav>
                
 
            </header>

            <main>
                <div>
                    <h2>Find the animal shelter near you</h2>
                    <div className="search-bar-container">
                        <input className="search-input" type="text" placeholder="Enter your city" ></input>
                        <button className="search-button">Search</button>
                    </div>
                </div>

                <button
                    type="button"
                    className="counter"
                    onClick={() => setCount((count) => count + 1)}
                >
                Count is {count}
                </button>

                <div className="map-container">
                    <div className="map">
                        <img className="map-image" src={mapImage} alt="Map"/>
                    </div>
                </div>


            </main>

            <footer></footer>
      
        </section>

    )
}

export default Home