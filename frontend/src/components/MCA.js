import React, { useEffect } from 'react';
import BookRow from './BookRow';
import '../styles/MCA.css'; 
import BookShelf from './BookShelf';
import Carousel from './Carousel';

const MCA = () => {
    return (
    <div>
          <div id="mca-section" className='mca'>
            <BookShelf shelfName="Currently Reading" /> 
            <BookShelf shelfName="To Be Read" />
            <BookShelf shelfName="Finished Reading" />
          </div>
          <div id="user-info-section" className='user-info-section'>
          <Carousel>
            <BookShelf shelfName="Currently Reading" /> 
            <BookShelf shelfName="To Be Read" />
            <BookShelf shelfName="Finished Reading" />
          </Carousel>
          </div>
    </div>

    );
}

export default MCA;