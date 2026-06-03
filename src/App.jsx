import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Elements/Home.jsx';
import About from './Elements/About.jsx';
import Contact from './Elements/Contact.jsx';
import SignIn from './Elements/SignIn.jsx';
import Map from './Elements/Map.jsx';
import EvolvingBackground from './EvolvingBackground.jsx';
import './App.css';

function App() {
  return (
    <EvolvingBackground>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </BrowserRouter>
    </EvolvingBackground>
  );
}

export default App;
