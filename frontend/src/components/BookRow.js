import React from 'react';
import '../styles/BookRow.css'; 
import BookSlot from './BookSlot';

const BookRow = ({ books }) => {
    return (
        <div>   
            <div className='book-row'>
                <BookSlot book={books[0] || null} />
                <BookSlot book={books[1] || null} />
                <BookSlot book={books[2] || null} />
            </div>
            <div className='book-row-base'>
                {/* Additional row base content if needed */}
            </div>
        </div>
    );
}

export default BookRow;
