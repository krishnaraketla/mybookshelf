import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// pages and components
import Home from './pages/Home';
import Login from './pages/Login';
import BookDetail from './pages/BookDetail';
import About from './pages/About';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const validateToken = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route
              path="/about"
              element={ <About />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
