import React from 'react';
import '../styles/BookSlot.css'; 

const BookSlot = () => {
    return (
        <div className='book-slot'>
            {/* http://books.google.com/books/content?id=JN-1EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api */}
            <img src="http://books.google.com/books/content?id=JN-1EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" alt="test"/>
        </div>

    );
}

export default BookSlot;