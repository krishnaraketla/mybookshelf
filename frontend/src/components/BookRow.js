import React from 'react';
import '../styles/BookRow.css'; 
import BookSlot from './BookSlot';

const BookRow = () => {
    const book1 = {
        src: "http://books.google.com/books/content?id=JN-1EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    };
    return (
        <div>   
            <div className='book-row'>
            <BookSlot book={book1} />
            <BookSlot />
            <BookSlot />
        </div>
            <div className='book-row-base'>

            </div>

        </div>
    );
}

export default BookRow;