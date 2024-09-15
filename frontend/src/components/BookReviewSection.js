import React, { useEffect } from 'react';
import '../styles/BookReviewSection.css'; 
import BookRating from '../components/BookRating';

const BookReviewSection = () => {
    return (
        <div className='book-review-section'>
                <div className="reviews-and-ratings-title"><h1>Reviews and Ratings</h1></div>
                <div className='rating-title'><h3>What do you think?</h3></div>
                <BookRating />
        </div>
    );
}

export default BookReviewSection;