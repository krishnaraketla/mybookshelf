import React, { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [placeholderText, setPlaceholderText] = useState("Search books by title");
    const [searchParam, setSearchParam] = useState("title");

    // Debounce function to limit API calls, wrapped in useCallback to maintain reference
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query) {
                try {
                    let url = `${process.env.REACT_APP_API_BASE_URL}/search/books`;
                    const params = new URLSearchParams();

                    if (searchParam === 'title') {
                        params.append('query', query);
                    } else if (searchParam === 'author') {
                        params.append('author', query);
                    } else if (searchParam === 'isbn') {
                        params.append('isbn', query);
                    }

                    // Fetch more results to have a full list for the results page
                    // Remove limit parameter or set it higher
                    url += `?${params.toString()}`;

                    const response = await fetch(url, { cache: "no-store" });
                    if (response.ok) {
                        const data = await response.json();
                        console.log(`Received ${data.length} results`); // For debugging
                        setResults(data); // Store all results
                        setShowDropdown(true);
                    } else {
                        console.error("Error fetching search results:", response.statusText);
                        setResults([]);
                        setShowDropdown(false);
                    }
                } catch (error) {
                    console.error("Error fetching search results:", error);
                    setResults([]);
                    setShowDropdown(false);
                }
            } else {
                setShowDropdown(false);
                setResults([]);
            }
        }, 500),
        [searchParam]
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
        console.log("Selected: ", result.title);
        setShowDropdown(false);
        // Navigate to the book detail page using the workID
        navigate(`/books/works/${result.workID}`);
        // Store the result in local storage if needed
        localStorage.setItem("bookDetail", JSON.stringify(result));
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

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

    const handleSeeMore = () => {
        // Navigate to the Search Results page with query and param as state or URL parameters
        navigate(`/search/books`, { state: { query: searchTerm, param: searchParam, results } });
        setShowDropdown(false);
    };

    // Function to get image URL
    const getImageUrl = (result) => {
        if (result.coverID) {
            return `https://covers.openlibrary.org/b/id/${result.coverID}-M.jpg`;
        } else {
            return "https://via.placeholder.com/150";
        }
    };

    return (
        <div className="search-bar-container" ref={wrapperRef}>
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <span className='chevron-icon'>
                <FontAwesomeIcon icon={faChevronDown} onClick={() => { setDropdownVisible(!dropdownVisible) }} />
                {dropdownVisible && (
                    <div className="search-options-dropdown" onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>
                        <div
                            className='search-options'
                            onClick={() => {
                                setPlaceholderText("Search books by title");
                                setSearchParam("title");
                                setDropdownVisible(false);
                            }}>
                            <p>Title</p>
                        </div>
                        <div
                            className='search-options'
                            onClick={() => {
                                setPlaceholderText("Search books by author");
                                setSearchParam("author");
                                setDropdownVisible(false);
                            }}>
                            <p>Author</p>
                        </div>
                        <div
                            className='search-options'
                            onClick={() => {
                                setPlaceholderText("Search books by ISBN");
                                setSearchParam("isbn");
                                setDropdownVisible(false);
                            }}>
                            <p>ISBN</p>
                        </div>
                    </div>
                )}
            </span>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="text"
                    placeholder={placeholderText}
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </form>
            {showDropdown && results.length > 0 && (
                <ul className="search-results-dropdown">
                    {results.slice(0, 5).map(result => (
                        <li key={result.workID} onClick={() => handleSelect(result)} className="dropdown-item">
                            <img src={getImageUrl(result)} alt={result.title} className="dropdown-item-image" />
                            <div className="dropdown-item-info">
                                <span className="dropdown-item-title">{result.title}</span>
                                <span className="dropdown-item-author">
                                    {result.authorNames && result.authorNames.length > 0 ? result.authorNames.join(', ') : 'Unknown Author'}
                                </span>
                            </div>
                        </li>
                    ))}
                    <li onClick={handleSeeMore} className="dropdown-view-more">
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
