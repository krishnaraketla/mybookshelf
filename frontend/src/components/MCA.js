import React, { useEffect } from 'react';
import BookRow from './BookRow';
import '../styles/MCA.css'; 
import BookShelf from './BookShelf';
import Carousel from './Carousel';
import LandingView from './LandingView';

const MCA = () => {
    return (
    <div>
          {/* <LandingView /> */}
          <div id="mca-section" className='mca'>
            <BookShelf shelfName="Currently Reading" /> 
            <BookShelf shelfName="To Be Read" />
            <BookShelf shelfName="Finished Reading" />
          </div>
          <div id="user-info-section" className='user-info-section'>
            
          </div>
    </div>

    );
}

export default MCA;