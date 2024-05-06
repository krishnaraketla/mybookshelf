import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    // Debounce function to limit API calls
    const debouncedSearch = debounce(async (query) => {
        if (query) {
            try {
                console.log(query)
                const response = await fetch(`http://localhost:4000/search/books/title?query="${encodeURIComponent(query)}"`, { cache: "no-store" });
                if (response.ok) {
                    const data = await response.json();
                    console.log(`Received ${data.length} results`); // For debugging
                    setResults(data.slice(0, 10)); // Limit to top 10 results
                    setShowDropdown(true);
                } else {
                    console.error("Error fetching search results:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        } else {
            setShowDropdown(false);
        }
    }, 500); // Adjusted debounce time to 500ms

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm]);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSelect = (result) => {
        setSearchTerm(result.title);
        setShowDropdown(false);
        navigate(`/books/${result._id}`);
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
                    placeholder="Search books by title..."
                    value={searchTerm}
                    onChange={handleChange}
                />
            </form>
            {showDropdown && (
                <ul className="search-results-dropdown">
                    {results.map(result => (
                        <li key={result._id} onClick={() => handleSelect(result)} className="dropdown-item">
                            <img src={result.image} alt={result.title} className="dropdown-item-image" />
                            <span>{result.title}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
