import React, { useEffect } from 'react';
import BookRow from './BookRow';
import '../styles/MCA.css'; 
import BookShelf from './BookShelf';
import Carousel from './Carousel';

const MCA = () => {
    return (
        <div id="mca-section" className='mca'>
          <BookShelf shelfName="Currently Reading" /> 
          <BookShelf shelfName="To Be Read" />
          <BookShelf shelfName="Finished Reading" />
        </div>
    );
}

export default MCA;