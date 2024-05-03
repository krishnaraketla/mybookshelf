import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();  // Prevent the default form submission behavior
        onSearch(searchTerm);   // Call the onSearch prop function passed from NavBar
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <input 
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
}

export default SearchBar;
