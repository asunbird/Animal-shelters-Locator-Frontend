import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { StrictMode } from 'react'
import App from './App.jsx'
import Elements from './Elements.jsx'
import Error from './Error.jsx'
import Home from './Home.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/elements",
    element: <Elements />
  },
  {
    path: "/error",
    element: <Error />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <App />
  </StrictMode>
);

