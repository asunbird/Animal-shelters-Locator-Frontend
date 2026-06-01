

import { BrowserRouter, Routes, Route }
  from "react-router-dom";
import Home from './Home.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import NavBar from './NavBar.jsx';

import "./App.css"

function App() {

  return (
   
            <BrowserRouter>
              <NavBar /> {/* Always visible */}
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </BrowserRouter>
    
    
  )
}

export default App
