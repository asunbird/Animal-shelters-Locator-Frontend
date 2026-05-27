
import './App.css'

function App() {

  return (

      <section id="center">
        <header>

            <div className="logo">
              <img className="logo-icon" src="/public/LOGO-icon.svg" alt="Pet Map Logo" />
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
              <ul>
                <li className="nav-sections"><a href="#" >Home</a></li>
                <li className="nav-sections"><a href="#" >About</a></li>
                <li className="autorisation"><a href="#" >Sign in</a></li>
              </ul>
            </nav>

        </header>

        <main>
          <div>
            <h1>Get started</h1>
          </div>
        </main>

        <footer></footer>
      </section>
      

    
    
  )
}

export default App
