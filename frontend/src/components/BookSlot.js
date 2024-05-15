import React from 'react';
import '../styles/BookSlot.css'; 

const BookSlot = ({ book }) => {

    return (
        <div className='book-slot'>
            {book && book.src ? <img src={book.src} alt="Book Cover" onClick={()=>{console.log("clicked!")}} onError={(e)=>{console.log(e)}}/> : null}
        </div>
    );
}

export default BookSlot;
