import { RouteObject } from 'react-router-dom';
import Home from './src/Home';
import About from './src/Elements/About';
import Contact from './src/Elements/Contact';
import SignIn from './src/Elements/SignIn';
import Map from './src/Elements/Map';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/map',
    element: <Map />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
];
