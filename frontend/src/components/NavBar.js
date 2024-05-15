import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import '../styles/NavBar.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
    const location = useLocation();
    const handleSearch = (searchTerm) => {
        console.log("Search for:", searchTerm);
    };

    return (
        <nav className="navbar">
            <div className="company-logo">
                <Link to="/"><img src="/logo.png" alt='logo'></img></Link>
            </div>
            <div className='search-bar-nav'>
                {location.pathname !== '/login' && <SearchBar onSearch={handleSearch} />}
            </div>
            <div className="right-links">
                <Link to="/">About</Link>
                <Link to="/">
                    <FontAwesomeIcon icon={faUser} />
                </Link>
            </div>
        </nav>

    );
}

export default NavBar;