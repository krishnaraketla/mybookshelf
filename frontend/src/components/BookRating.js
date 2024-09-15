// BookRating.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Rating, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import '../styles/BookRating.css';

const BookRating = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [plotRating, setPlotRating] = useState(0);
  const [charactersRating, setCharactersRating] = useState(0);
  const [writingStyleRating, setWritingStyleRating] = useState(0);
  const [originalityRating, setOriginalityRating] = useState(0);
  const [enjoymentRating, setEnjoymentRating] = useState(0);

  const componentRef = useRef(null); // Reference to the component's root element

  const calculateAverage = () => {
    const total =
      plotRating +
      charactersRating +
      writingStyleRating +
      originalityRating +
      enjoymentRating;
    const count = 5;
    const average = total / count;
    return Math.round(average * 10) / 10; // Round to 1 decimal place
  };

  const averageRating = calculateAverage();

  // Effect to scroll to the component when it expands
  useEffect(() => {
    if (isExpanded && componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isExpanded]);

  return (
    <div className={`book-rating ${isExpanded ? 'expanded' : 'collapsed'}`} ref={componentRef}>
      {isExpanded ? (
        // Expanded view
        <div className="rating-container">
          <Typography variant="h6" className="section-title">
            Rate the Book
          </Typography>

          <div className="rating-field">
            <Typography component="legend">Plot</Typography>
            <Rating
              name="plotRating"
              value={plotRating}
              onChange={(event, newValue) => {
                setPlotRating(newValue);
              }}
            />
          </div>

          <div className="rating-field">
            <Typography component="legend">Characters</Typography>
            <Rating
              name="charactersRating"
              value={charactersRating}
              onChange={(event, newValue) => {
                setCharactersRating(newValue);
              }}
            />
          </div>

          <div className="rating-field">
            <Typography component="legend">Writing Style</Typography>
            <Rating
              name="writingStyleRating"
              value={writingStyleRating}
              onChange={(event, newValue) => {
                setWritingStyleRating(newValue);
              }}
            />
          </div>

          <div className="rating-field">
            <Typography component="legend">Originality</Typography>
            <Rating
              name="originalityRating"
              value={originalityRating}
              onChange={(event, newValue) => {
                setOriginalityRating(newValue);
              }}
            />
          </div>

          <div className="rating-field">
            <Typography component="legend">Overall Enjoyment</Typography>
            <Rating
              name="enjoymentRating"
              value={enjoymentRating}
              onChange={(event, newValue) => {
                setEnjoymentRating(newValue);
              }}
            />
          </div>

          <div className="done-button">
            <button onClick={() => setIsExpanded(false)}>Done</button>
          </div>
        </div>
      ) : (
        // Collapsed view
        <div className="collapsed-view">
          {averageRating > 0 ? (
            <>
              <Typography component="legend"></Typography>
              <Rating
                size="large"
                name="averageRating"
                value={averageRating}
                precision={0.1}
                readOnly
              />
            </>
          ) : (
            <Typography component="legend">Rate this book</Typography>
          )}
          <IconButton onClick={() => setIsExpanded(true)}>
            <EditIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default BookRating;
