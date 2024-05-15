import React from 'react';
import '../styles/BookShelf.css'; 
import BookRow from './BookRow';

const BookShelf = ({ shelfName }) => {
    return (
        <div className='book-shelf'>
            <h1>{shelfName}</h1>
            <BookRow />
            <BookRow />
            <BookRow />
            <div className="navigation-arrows">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="rgba(237, 238, 213, 0.5)" className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="rgba(237, 238, 213, 0.5)" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
        </div>

    );
}

export default BookShelf;