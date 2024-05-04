import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [results, setResults] = useState([]); // This will hold search results

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length > 0) {
            setShowDropdown(true);
            // Dummy data, replace with actual search logic fetching from backend
            setResults([
                { id: 1, text: 'The Bell Jar by Sylvia Plath' },
                { id: 2, text: 'The Unabridged Journals of Sylvia Plath' },
                { id: 3, text: 'Bared to You by Sylvia Day' }
            ]);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
        setShowDropdown(false); // Hide dropdown when search is submitted
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit} className="search-form">
                <input 
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={handleChange}
                />
            </form>
            {showDropdown && (
                <ul className="search-results-dropdown">
                    {results.map(result => (
                        <li key={result.id} onClick={() => {
                            setSearchTerm(result.text);
                            setShowDropdown(false);
                        }}>
                            {result.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );
}

export default SearchBar;
