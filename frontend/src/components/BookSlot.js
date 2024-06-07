import React, { useEffect } from 'react';
import '../styles/BookSlot.css'; 

const BookSlot = ({ book }) => {

    // useEffect(() => {
    //     // console.log(book)
    // }, [book]);

    if (!book) {
        return (
            <div className='book-slot'>
                {/* Add any content or styling for an empty slot */}
            </div>
        );
    }
    return (
        <div className='book-slot'>
            {book && book.googleId ? <img src={book.image} alt="Book Cover" onClick={()=>{console.log("clicked!")}} onError={(e)=>{console.log(e)}}/> : null}
        </div>
    );
}

export default BookSlot;
