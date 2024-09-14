import React, { useState } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import useMediaQuery from '@mui/material/useMediaQuery';

const BookSlotTooltip = ({ children, title, description, rating }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:40em)');

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip 
      {...props} 
      classes={{ popper: className }} 
      enterDelay={2000}
      arrow
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#e6dcc8',
      color: '#6d6460',
      width: '220px', // Fixed width
      fontSize: theme.typography.pxToRem(12),
      borderRadius: '10px', // Rounded corners
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)', // Subtle shadow
      padding: '10px', // Padding for spacing
    }
  }));

  const handleSeeMore = (e) => {
    e.stopPropagation(); // Prevent the tooltip from closing
    setShowFullDescription(!showFullDescription);
  };

  const renderDescription = () => {
    const maxLength = 500; // Max characters before "See More"
    if (description && description.length > maxLength && !showFullDescription) {
      return (
        <>
          {description.substring(0, maxLength)}...
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#1a73e8', 
              cursor: 'pointer', 
              padding: 0,
              fontSize: 'inherit'
            }}
            onClick={handleSeeMore}
          >
            See More
          </button>
        </>
      );
    }
    return (
      <>
        {description}
        {description && description.length > maxLength && (
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#1a73e8', 
              cursor: 'pointer', 
              padding: 0,
              fontSize: 'inherit'
            }}
            onClick={handleSeeMore}
          >
            {showFullDescription ? "See Less" : ""}
          </button>
        )}
      </>
    );
  };

  return (
    <HtmlTooltip
      title={isSmallScreen ? '' : (
        <React.Fragment>
          <strong>{title || "No Title Available"}</strong>
          <p>{renderDescription()}</p>
          <div className="book-detail-rating">
            <span style={{ marginLeft: '5px' }}>Average rating: </span>
            <Rating name="half-rating-read" defaultValue={rating} precision={0.5} size="small" readOnly />
          </div>
        </React.Fragment>
      )}
      placement="right"
      arrow
    >
      {children}
    </HtmlTooltip>
  );
};

export default BookSlotTooltip;
