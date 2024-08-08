import React, { useEffect } from 'react';
import BookRow from './BookRow';
import '../styles/MCA.css'; 
import BookShelf from './BookShelf';
import Carousel from './Carousel';
import LandingView from './LandingView';

const MCA = () => {
    return (
        <div id="mca-section" className='mca'>
          <BookShelf shelfName="To Be Read" />
          <BookShelf shelfName="Currently Reading" /> 
          <BookShelf shelfName="Finished Reading" />
        </div>
    );
}

export default MCA;