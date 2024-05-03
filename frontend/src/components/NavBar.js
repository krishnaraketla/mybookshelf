import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
// import './NavBar.css';  // Ensure this is uncommented if you have styles in NavBar.css

const NavBar = () => {
    const handleSearch = (searchTerm) => {
        console.log("Search for:", searchTerm);  // This will log the search term from SearchBar
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to="/">My Bookshelf</Link>
                <SearchBar onSearch={handleSearch} />
                <Link to="/about">About</Link>
                <Link to="/contact">Contact Us</Link>
            </div>
        </nav>
    );
}

export default NavBar;
