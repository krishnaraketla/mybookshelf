import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/BookDetail.css'; 
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons';
import BookReviewSection from '../components/BookReviewSection';
import Rating from '@mui/material/Rating';
import BookCover from '../components/BookCover';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [edition, setEdition] = useState(null); // Track selected edition
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shelves, setShelves] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false); // Hover dropdown for shelves
    const [isBookInShelf, setIsBookInShelf] = useState(""); // Tracks if book is in any shelf

    // Fetch book details
    const fetchBook = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            console.log(token)
            // const bookDetail = localStorage.getItem("bookDetail");
            // if (bookDetail) {
            //     const data = JSON.parse(bookDetail);
            //     setBook(data);
            //     setEdition(data.editions[0]); // Show the first edition by default
            // } 
            {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/search/books/works/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                if (response.ok) {
                    const data = await response.json();
                    setBook(data);
                    setEdition(data.editions[0]); // Show the first edition by default
                } else {
                    console.log("Book not found")
                    setError("Book not found");
                }
            }
        } catch (error) {
            console.log("error fetching")
            setError("Error fetching book details");
        }
        setLoading(false);
    };

    const fetchShelves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/shelves`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });
            if (response.ok) {
                const data = await response.json();
                setShelves(data);
            } else {
                setError("Error fetching shelves");
            }
        } catch (error) {
            setError("Error fetching shelves");
        }
    };

    const checkBookInShelves = async (shelvesData) => {
        try {
            const token = localStorage.getItem('token');
            for (const shelf of shelvesData) {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${shelf.url}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                if (response.ok) {
                    const books = await response.json();
                    if (books.some(b => b._id === book._id)) {
                        setIsBookInShelf(shelf._id);
                        return;
                    }
                }
            }
        } catch (error) {
            setError("Error checking book in shelves");
        }
    };

    const toggleShelf = async (shelf) => {
        if (isBookInShelf === "") {
            addBookToShelf(shelf);
        } else {
            if (shelf._id === isBookInShelf) {
                removeBookFromShelf(shelf);
            } else {
                await removeBookFromShelf(null);
                addBookToShelf(shelf);
            }
        }
    };

    const addBookToShelf = async (shelf) => {
        const token = localStorage.getItem('token');
        const bookDetail = localStorage.getItem("bookDetail");
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${shelf.url}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                body: bookDetail,
            });

            if (response.ok) {
                setIsBookInShelf(shelf._id);
            } else {
                console.error("Error adding book to shelf");
            }
        } catch (error) {
            setError("Error adding book to shelf");
        }
    };

    const removeBookFromShelf = async (shelfSelected) => {
        const token = localStorage.getItem('token');
        let foundBook = null;
        let foundShelf = null;

        try {
            for (const shelf of shelves) {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${shelf.url}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                if (response.ok) {
                    const books = await response.json();
                    const bookInShelf = books.find(b => b._id === book._id);
                    if (bookInShelf) {
                        foundBook = bookInShelf;
                        foundShelf = shelf;
                        break;
                    }
                }
            }
        } catch (error) {
            setError("Error checking book in shelves");
        }

        if (!shelfSelected) {
            shelfSelected = foundShelf;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${shelfSelected.url}/${foundBook._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });

            if (response.ok) {
                setIsBookInShelf("");
            } else {
                console.error("Error removing book from shelf");
            }
        } catch (error) {
            setError("Error removing book from shelf");
        }
    };

    const handleEditionChange = (selectedEdition) => {
        setEdition(selectedEdition);
    };

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

    useEffect(() => {
        fetchBook(id);
        // fetchShelves();
    }, [id]);

    // useEffect(() => {
    //     if (shelves.length > 0 && book) {
    //         checkBookInShelves(shelves);
    //     }
    // }, [shelves, book]);

    if (loading) {
        return(<div><NavBar showRightLinks="true"/> <div className="book-detail-loading">Loading...</div></div>);
    }

    if (error) {
        return (
            <div className='book-detail-page'>
                <NavBar showRightLinks="true"/>
                <div className="book-detail-container">
                    <div className="book-detail-image">
                        <img src={'https://via.placeholder.com/150'} alt="text" />
                        <div className='book-row-base-full' />
                    </div>
                    <div className="book-detail-info">
                        <div className="book-title">Title <span className='shelves-icon'><FontAwesomeIcon icon={faSolidBookmark} /> </span> </div>
                        <div className="book-author">Author</div>
                        <div className="book-detail-rating">
                            <span>★</span> Avg Rating
                        </div>
                        <div className="book-description" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='book-detail-page'>
            <NavBar showRightLinks="true"/>
            <div className="book-detail-container">
                <div className="book-detail-image">
                <BookCover book={book} edition={edition} className="book-cover--large"/>
                <div className='book-row-base-full' />
                </div>
                <div className="book-detail-info">
                    <div className="book-title">
                        {book.title} 
                        <span 
                            className='shelves-icon' 
                            onMouseEnter={handleMouseEnter} 
                            onMouseLeave={handleMouseLeave}
                            style={{ position: 'relative' }} /* Ensure relative positioning */
                        >
                            <FontAwesomeIcon 
                                icon={isBookInShelf ? faSolidBookmark : faRegularBookmark} 
                                style={{ color: isBookInShelf ? 'gray' : 'white' }} 
                            />
                            {dropdownVisible && (
                                <div className="shelves-dropdown">
                                    {shelves.map(shelf => (
                                        <div key={shelf._id} className={`shelf-item ${isBookInShelf === shelf._id ? 'bookInShelf' : ''}`} onClick={() => toggleShelf(shelf)}><p>{shelf.name}</p></div>
                                    ))}
                                </div>
                            )}
                        </span> 
                    </div>
                    <div className="book-author">{book.authorNames.join(', ')}</div>
                    {/* Editions Dropdown */}
                    {book.editions.length > 1 && (
                        <div className="book-editions-dropdown">
                            <label htmlFor="editions">Select Edition: </label>
                            <select 
                                id="editions" 
                                value={edition?.editionID || ''}
                                onChange={(e) => handleEditionChange(book.editions.find(ed => ed.editionID === e.target.value))}
                            >
                                {book.editions.map(ed => (
                                    <option key={ed.editionID} value={ed.editionID}>
                                        {ed.title} ({ed.publishDate} {ed.publishers?.join(', ') || 'Unknown Publisher'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className='book-pages-publisher'>{edition?.publishDate ? `Published in ${edition.publishDate}` : 'Unknown publish date'} by {edition?.publishers?.join(', ')}</div>
                    <div className='book-pages-publisher'>ISBN: {edition?.isbn.join(', ') || 'Unknown ISBN'}</div>
                    <div className="book-detail-rating">
                        <Rating name="half-rating-read" defaultValue={book.averageRating} precision={0.5} readOnly />
                        <span style={{ marginLeft: '5px' }}>{book.averageRating} Average rating</span>
                    </div>
                    <div className="book-description">
                        {/* Display work description */}
                        {book.workDescription && (
                            <div className="work-description">
                                <h3>About the Book</h3>
                                <div dangerouslySetInnerHTML={{ __html: book.workDescription }} />
                            </div>
                        )}
                        {/* Display edition description */}
                        {edition && edition.editionDescription && (
                            <div className="edition-description">
                                <h3>About this Edition</h3>
                                <div dangerouslySetInnerHTML={{ __html: edition.editionDescription }} />
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <BookReviewSection />
        </div>
    );
};

export default BookDetail;
