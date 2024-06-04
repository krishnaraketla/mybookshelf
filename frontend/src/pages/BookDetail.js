import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/BookDetail.css'; 
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shelves, setShelves] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isBookInShelf, setisBookInShelf] = useState(false);

    const fetchBook = async (id) => {
        setLoading(true);
        try {

            const token = localStorage.getItem('token');
            console.log(token)
            // Make the fetch request with the token in the Authorization header
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
                console.log("==== shelves ====")
                console.log(shelves)
            } else {
                setError("Error fetching shelves");
            }
        } catch (error) {
            setError("Error fetching shelves");
        }
    };

    useEffect(() => {
        console.log("Component re-rendered!");
        fetchBook(id);
        fetchShelves();
    }, [id]);

    const handleMouseEnter = () => {
        setDropdownVisible(true);
    };

    const handleMouseLeave = () => {
        setDropdownVisible(false);
    };

    if (loading) {
        return(<div><NavBar /> <div className="book-detail-loading">Loading...</div></div>);
    }

    if (error) {
        return (
            <div className='book-detail-page'>
                <NavBar />
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
            <NavBar />
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
                            <FontAwesomeIcon icon={faBookmark} /> 
                            {dropdownVisible && (
                                <div className="shelves-dropdown">
                                    {shelves.map(shelf => (
                                        <div key={shelf._id} className="shelf-item">{shelf.name}</div>
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
