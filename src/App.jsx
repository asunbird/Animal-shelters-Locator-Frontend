
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  Home, 
  SignIn, 
  Map 
} from './Home.jsx';
import { About, Contact, Info, Address } from './Elements.jsx';
import Error from  './Error.jsx';
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
                <Route path="/about/address" element={<Address />} />
            </Route>
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </EvolvingBackground>
  )
}

export default App;