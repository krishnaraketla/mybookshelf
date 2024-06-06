import React, { useState, useEffect } from 'react';
import '../styles/BookRow.css'; 
import BookSlot from './BookSlot';

const BookRow = (books) => {

    const [book1, setBook1] = useState([]);
    const [book2, setBook2] = useState([]);
    const [book3, setBook3] = useState([]);

    useEffect(() => {
        setBook1(books[0]);
        setBook2(books[1]);
        setBook3(books[2]);
    }, []);

    useEffect(() => {
        console.log("Book Row")
        console.log(books)
    }, [books]);

    return (
        <div>   
            <div className='book-row'>
            <BookSlot book={book1} />
            <BookSlot book={book2}/>
            <BookSlot book={book3}/>
        </div>
            <div className='book-row-base'>

            </div>

        </div>
    );
}

export default BookRow;