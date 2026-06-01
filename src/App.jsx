

import { BrowserRouter, Routes, Route }
  from "react-router-dom";
import Home from './Home.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import SignIn from './SignIn.jsx';

import "./App.css"

function App() {

  return (
   
            <BrowserRouter>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
              </Routes>
            </BrowserRouter>
    
    
  )
}

export default App
