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

    const fetchBook = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:4000/search/books/${id}`, { cache: "no-store" });
            if (response.ok) {
                const data = await response.json();
                setBook(data);
            } else {
                setError("Book not found");
            }
        } catch (error) {
            setError("Error fetching book details");
        }
        setLoading(false);
    };

    useEffect(() => {
            console.log("Component re-rendered!");
            fetchBook(id);
    }, [id]);

    if (loading) {
        return(<div><NavBar /> <div className="book-detail-loading">Loading...</div></div>);
    }

    if (error) {
        // return <div className="book-detail-error">{error}</div>;
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
                    <div className="book-title">{book.title} <span className='shelves-icon'><FontAwesomeIcon icon={faBookmark} /> </span> </div>
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
