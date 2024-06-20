import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import React, { useEffect, useState } from 'react';
// pages and components
import Home from './pages/Home';
import Login from './pages/Login';
import BookDetail from './pages/BookDetail';
import './App.css'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async () => {
        const response = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: 'testuser', password: 'testpassword' })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
        } else {
            throw new Error('Login failed');
        }
    };

    useEffect(() => {
        login().catch(error => {
            console.error(error);
            setIsAuthenticated(false);
        });
    }, []);

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }

  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route 
              path='/'
              element={!isAuthenticated ? <Home /> : <Navigate to="/login" />}
            />
            <Route 
              path='/login'
              element={<Login />}
            />
            <Route path="/books/:id" element={<BookDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
