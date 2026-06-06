
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  Home, 
  Map 
} from './Home.jsx';
import { About, Info, Contact } from './Elements.jsx';
import Error from  './Error.jsx';
import SignIn from  './SignIn.jsx';
import EvolvingBackground from './EvolvingBackground.jsx';
import './App.css';

function App() {
  return (
      <EvolvingBackground>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/map" element={<Map />} />
            <Route path="/about" element={<About />} >
                <Route path="/about/info" element={<Info />} />
                <Route path="/about/contact" element={<Contact />} />
            </Route>
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </EvolvingBackground>
  )
}

export default App;