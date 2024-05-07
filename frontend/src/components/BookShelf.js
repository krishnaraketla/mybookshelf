import React from 'react';
import '../styles/BookShelf.css'; 
import BookRow from './BookRow';

const BookShelf = () => {
    return (
        <div className='book-shelf'>
            <BookRow />
            <BookRow />
            <BookRow />
        </div>

    );
}

export default BookShelf;