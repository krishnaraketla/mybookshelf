import React from 'react';
import '../styles/BookRow.css'; 
import BookSlot from './BookSlot';

const BookRow = () => {
    return (
        <div className='book-row'>
            <BookSlot />
            <BookSlot />
            <BookSlot />
        </div>

    );
}

export default BookRow;