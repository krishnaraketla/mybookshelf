import React from 'react';
import '../styles/BookSlot.css'; 
import { useNavigate } from 'react-router-dom';
import BookSlotTooltip from './BookSlotTooltip';

const BookSlot = ({ book }) => {
    const navigate = useNavigate();

    if (!book) {
        return (
            <div className='book-slot'>
                {/* Add any content or styling for an empty slot */}
            </div>
        );
    }

    return (
        <BookSlotTooltip
            title={book.title}
            description={book.description}
            rating={book.averageRating}
        >
            <div className='book-slot'>
                {book && book._id ? (
                    <img 
                        src={book.image} 
                        alt="Book Cover" 
                        onClick={() => { 
                            localStorage.setItem("bookDetail", JSON.stringify(book));
                            navigate(`/books/${book._id}`);
                        }} 
                        onError={(e) => { console.log(e); }}
                    />
                ) : null}
            </div>
        </BookSlotTooltip>
    );
}

export default BookSlot;