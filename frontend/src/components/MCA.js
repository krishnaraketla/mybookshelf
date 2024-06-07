import React, { useEffect } from 'react';
import BookRow from './BookRow';
import '../styles/MCA.css'; 
import BookShelf from './BookShelf';

const MCA = () => {

    useEffect(() => {
        const handleScroll = () => {
          const mcaSection = document.getElementById('mca-section');
          const userInfoSection = document.getElementById('user-info-section');
    
          if (window.scrollY + window.innerHeight >= mcaSection.offsetHeight) {
            userInfoSection.scrollIntoView({ behavior: 'smooth' });
          }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

    return (
        <div>
      <div id="mca-section" className='mca'>
        <BookShelf shelfName="Currently Reading" /> 
        <BookShelf shelfName="To Be Read" />
        <BookShelf shelfName="Finished Reading" />
      </div>
      <div id="user-info-section" className='user-info-section'>
        <h1>scroll for more</h1>
        <p>Details about the user...</p>
      </div>
    </div>

    );
}

export default MCA;