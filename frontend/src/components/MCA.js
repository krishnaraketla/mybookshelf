import React from 'react';
import BookRow from './BookRow';
import '../styles/MCA.css'; 
import BookShelf from './BookShelf';

const MCA = () => {
    return (
        <div className='mca'>
            <BookShelf shelfName="Currently Reading" /> 
            <BookShelf shelfName="To be read" />
            <BookShelf shelfName="Finished Reading" />
        </div>

    );
}

export default MCA;