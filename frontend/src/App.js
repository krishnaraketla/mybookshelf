import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import React, { useEffect, useState } from 'react';
// pages and components
import Home from './pages/Home';
import Login from './pages/Login';
import BookDetail from './pages/BookDetail';
import './App.css'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Check if the user is already authenticated
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }, []);


  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route 
              path='/'
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
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
