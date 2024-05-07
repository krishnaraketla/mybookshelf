import React from 'react';
import BookRow from './BookRow';
import '../styles/MCA.css'; 
import BookShelf from './BookShelf';

const MCA = () => {
    return (
        <div className='mca'>
            <BookShelf />
            <BookShelf />
            <BookShelf />
        </div>

    );
}

export default MCA;