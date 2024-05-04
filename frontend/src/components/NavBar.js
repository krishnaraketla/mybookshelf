import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
// import './NavBar.css';

const NavBar = () => {
    const location = useLocation();  // This hook gives us access to the location object
    const handleSearch = (searchTerm) => {
        console.log("Search for:", searchTerm);
    };

    return (
        <nav className="navbar">
            <div className="company-logo">
                <Link to="/">My Bookshelf</Link>
            </div>
            <div className='search-bar-nav'>
                {location.pathname !== '/login' && <SearchBar onSearch={handleSearch} />}
            </div>
            <div className="right-links">
                <Link to="/about">About</Link>
                <Link to="/contact">Contact Us</Link>
            </div>
        </nav>

    );
}

export default NavBar;