import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/Home';
import { Login } from "./pages/Login";
import { Register } from './pages/Register';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  }

])

function App() {

  return <RouterProvider router={appRouter} />

}

export default App
