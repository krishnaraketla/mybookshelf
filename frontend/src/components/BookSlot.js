import React, { useEffect } from 'react';
import '../styles/BookSlot.css'; 
import { useNavigate } from 'react-router-dom';

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
        <div className='book-slot'>
            {book && book.googleId ? <img src={book.image} alt="Book Cover" onClick={()=>{ 
                localStorage.setItem("bookDetail", JSON.stringify(book))
                navigate(`/books/${book.googleId}`)
            }} 
                onError={(e)=>{console.log(e)}}/> : null}
        </div>
    );
}

export default BookSlot;
