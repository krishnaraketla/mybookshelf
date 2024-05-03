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
            <div className="nav-links">
                <Link to="/">My Bookshelf</Link>
                {/* Only render SearchBar if the current route is not /login */}
                {location.pathname !== '/login' && <SearchBar onSearch={handleSearch} />}
                <Link to="/about">About</Link>
                <Link to="/contact">Contact Us</Link>
            </div>
        </nav>
    );
}

export default NavBar;