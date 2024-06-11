import React, { useEffect } from 'react';
import BookRow from './BookRow';
import '../styles/LandingView.css'; 
import BookShelf from './BookShelf';
import Carousel from './Carousel';

const LandingView = () => {
    return (
    <div className='landing-view-section'>
          <div id="intro-div" className='intro-div'>
              <p> Your bookshelf awaits! Keep your reading organized, explore the top books, and get recommendations based on your reading habits.</p>
          </div>
          <div id="bestseller-carousel" className='bestseller-carousel'>
            <Carousel>
              <BookShelf shelfName="Currently Reading" /> 
              <BookShelf shelfName="To Be Read" />
              <BookShelf shelfName="Finished Reading" />
            </Carousel>
          </div>
    </div>

    );
}

export default LandingView;