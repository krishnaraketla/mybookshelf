import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/BookDetail.css'; 
import NavBar from '../components/NavBar';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
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

        fetchBook();
    }, [id]);

    if (loading) {
        return <div className="book-detail-loading">Loading...</div>;
    }

    if (error) {
        // return <div className="book-detail-error">{error}</div>;
        return (
            <div>
                <NavBar />
                <div className="book-detail-container">
                    <div className="book-detail-image">
                        <img src={'https://via.placeholder.com/150'} alt="text" />
                    </div>
                    <div className="book-detail-info">
                        <h1 className="book-title">Title</h1>
                        <h2 className="book-author">Author</h2>
                        <p className="book-detail-rating">
                            <span>★</span> Avg Rating
                        </p>
                        <div className="book-description" />
                        <div className="book-detail-actions">
                            <button>Currently Reading</button>
                            <button>To Be Read</button>
                            <button>Finished Reading</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <div className="book-detail-container">
                <div className="book-detail-image">
                    <img src={book.image || 'https://via.placeholder.com/150'} alt={book.title} />
                </div>
                <div className="book-detail-info">
                    <h1 className="book-title">{book.title}</h1>
                    <h2 className="book-author">{book.authors.join(', ')}</h2>
                    <p className="book-detail-rating">
                        <span>★</span> {book.averageRating}
                    </p>
                    <div className="book-description" dangerouslySetInnerHTML={{ __html: book.description }} />
                    <div className="book-detail-actions">
                        <button>Currently Reading</button>
                        <button>To Be Read</button>
                        <button>Finished Reading</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
