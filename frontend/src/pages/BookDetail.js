import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/BookDetail.css'; 
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shelves, setShelves] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isBookInShelf, setisBookInShelf] = useState(String);

    const fetchBook = async (id) => {
        setLoading(true);
        try {

            const token = localStorage.getItem('token');
            console.log(token)
            // Make the fetch request with the token in the Authorization header
            const bookDetail = localStorage.getItem("bookDetail")
            if(bookDetail){
                setBook(JSON.parse(bookDetail))
            }
            else{
                const response = await fetch(`http://localhost:4000/search/books/${id}`, {
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
                } else {
                    console.log("Book not found")
                    setError("Book not found");
                }
            }
        } catch (error) {
            setError("Error fetching book details");
        }
        setLoading(false);
    };

    const fetchShelves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/shelves', {
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

    const checkBookInShelves = async (data) => {
        try {
            const token = localStorage.getItem('token');
            for (const shelf of data) {
                const response = await fetch(`http://localhost:4000${shelf.url}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                if (response.ok) {
                    const books = await response.json();
                    if (books.some(b => b.googleId === book.googleId)) {
                        setisBookInShelf(shelf.id);
                        return;
                    }
                } else {
                    setisBookInShelf("");
                    setError(`Error fetching books for shelf ${shelf.name}`);
                }
            }
        } catch (error) {
            console.log(error)
            setError("Error checking book in shelves");
        }
    };

    const toggleShelf = async(shelf) => {
        if ( isBookInShelf === "")
            {
                // ADD book to shelf
                addBookToShelf(shelf)
            }
            else
            {   
                // Remove book from shelf if selected shelf contains book, else -> remove and add to new shelf
                if(shelf._id === isBookInShelf)
                {   
                    removeBookToShelf(shelf)
                }
                else
                {   
                    await removeBookToShelf(null)
                    addBookToShelf(shelf)
                }
                
            }
    }

    const addBookToShelf = async (shelf) => {
        const token = localStorage.getItem('token');
        const bookDetail = localStorage.getItem("bookDetail")
        try{
            const response = await fetch(`http://localhost:4000${shelf.url}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                body: bookDetail
            });

            if (response.ok) {
                setisBookInShelf(shelf.id)
            } else {
                console.log("Error adding book to shelf")
            }
        }
        catch(error){
            console.log(error)
            setError("Error adding book in shelf");
        }
    }

    const removeBookToShelf = async (shelfSelected) => {
        const token = localStorage.getItem('token');
        let foundBook = null
        let foundShelf = null

        try {
            const token = localStorage.getItem('token');
            for (const shelf of shelves) {
                const response = await fetch(`http://localhost:4000${shelf.url}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                if (response.ok) {
                    const books = await response.json();
                    const bookInShelf = books.find(b => b.googleId === book.googleId);
                    if (bookInShelf) {
                        foundBook = bookInShelf; // Capture the found book
                        foundShelf = shelf;
                        break; // Exit the loop if the book is found
                    }
                } else {
                    setError(`Error fetching books for shelf ${shelf.name}`);
                }
            }
        } catch (error) {
            console.log(error)
            setError("Error checking book in shelves");
        }

        if(!shelfSelected)
        {
            shelfSelected = foundShelf
        }
        try{
            const response = await fetch(`http://localhost:4000${shelfSelected.url}/${foundBook._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });

            if (response.ok) {
                setisBookInShelf("")
            } else {
                console.log("Error removing book to shelf")
            }
        }
        catch(error){
            console.log(error)
            setError("Error removing book in shelf");
        }
    }

    useEffect(() => {
        fetchBook(id);
        fetchShelves();
    }, [id]);

    useEffect(() => {
    }, [shelves]);

    useEffect(() => {
        if (shelves.length > 0 && book) {
            checkBookInShelves(shelves);
        }
    }, [shelves, book]);

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

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
                        <div className="book-title">Title <span className='shelves-icon'><FontAwesomeIcon icon={faBookmark} /> </span> </div>
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
                    <img src={book.image || 'https://via.placeholder.com/150'} alt={book.title} />
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
                                        <div key={shelf._id} className={`shelf-item ${isBookInShelf === shelf._id? 'bookInShelf' : ''}`} onClick={() => toggleShelf(shelf)}><p>{shelf.name}</p></div>
                                    ))}
                                </div>
                            )}
                        </span> 
                    </div>
                    <div className="book-author">{book.authors.join(', ')}</div>
                    <div className="book-detail-rating">
                        <span>★</span> {book.averageRating}
                    </div>
                    <div className="book-description" dangerouslySetInnerHTML={{ __html: book.description }} />
                </div>
            </div>
        </div>

    );
};

export default BookDetail;
