import React, { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css'; 

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    // Debounce function to limit API calls, wrapped in useCallback to maintain reference
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query) {
                try {
                    const response = await fetch(`http://localhost:4000/search/books/title?query="${encodeURIComponent(query)}"`, { cache: "no-store" });
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`Received ${data.length} results`); // For debugging
                        setResults(data.slice(0, 5)); // Limit to top 5 results
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
        }, 5000),
        [] // Empty dependencies array means the function is created only once
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    useEffect(() => {
        // Close the dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSelect = (result) => {
        // setSearchTerm(result.title);
        console.log("Selected: ",result.title)
        setShowDropdown(false);
        navigate(`/books/${result.googleId}`);
        localStorage.setItem("bookDetail", JSON.stringify(result))
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
        setShowDropdown(false);
    };

    const handleFocus = () => {
        if (searchTerm) {
            setShowDropdown(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 100);
    };

    return (
        <div className="search-bar-container" ref={wrapperRef}>
            <form onSubmit={handleSubmit} className="search-form">
                <input 
                    type="text"
                    placeholder="Search books by title..."
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </form>
            {showDropdown && (
                <ul className="search-results-dropdown">
                    {results.map(result => (
                        <li key={result.googleId} onClick={() => handleSelect(result)} className="dropdown-item">
                            <img src={result.image} alt={result.title} className="dropdown-item-image" />
                            <div className="dropdown-item-info">
                                <span className="dropdown-item-title">{result.title}</span>
                                <span className="dropdown-item-author">{result.authors.join(', ')}</span>
                            </div>
                        </li>
                    ))}
                    <li>
                        <div className='dropdown-view-more'>
                            <h5>See more.</h5>
                        </div>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default SearchBar;

//http://localhost:3000/books/665cb66c205c922a22f0837d