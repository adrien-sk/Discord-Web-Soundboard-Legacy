import { useEffect, useState } from 'react'
import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        // Call /auth/isloggedin to check if user is logged in
        // Then setup isauthenticated data
        //fetchData().then(response => setData(response));
      }, []);

    return (
        <>
        {
            isAuthenticated ? (
                <Dashboard />
            ) : (
                <Login />
            )
        }
        </>
    )
}

export default App
