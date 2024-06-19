import React, { useState } from 'react';
import '../styles/Rating.css'; 

const RatingEditable = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const handleRating = (value) => {
    setRating(value);
  };

  const ratingDescriptions = {
    5: 'Excellent!',
    4: 'Great!',
    3: 'Good',
    2: 'Okay',
    1: 'Bad'
  };

  return (
    <div className="rating">
      {[5, 4, 3, 2, 1].map((star) => (
        <React.Fragment key={star}>
          <input
            type="radio"
            id={`star${star}`}
            name="rate"
            value={star}
            checked={rating === star}
            onChange={() => handleRating(star)}
          />
          <label
            title={ratingDescriptions[star]}
            htmlFor={`star${star}`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
              <path
                d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
              ></path>
            </svg>
            {hover === star && <span className="tooltip">{ratingDescriptions[star]}</span>}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default RatingEditable;
