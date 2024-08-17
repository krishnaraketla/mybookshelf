import React, { useState } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';

const BookSlotTooltip = ({ children, title, description, rating }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

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
            border: '1px solid black',
            borderRadius: '10px', // Adding rounded corners for a softer look
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
            padding: '10px', // Adding padding for better content spacing
        }
    }));

    const handleSeeMore = (e) => {
        e.stopPropagation(); // Prevent the tooltip from closing
        setShowFullDescription(!showFullDescription);
    };

    const renderDescription = () => {
        const maxLength = 500; // Maximum characters before showing "See More"
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
            title={
                <React.Fragment>
                    <strong>{title || "No Title Available"}</strong>
                    <p>{renderDescription()}</p>
                    <div className="book-detail-rating">
                        <span style={{ marginLeft: '5px' }}>Average rating: </span>
                        <Rating name="half-rating-read" defaultValue={rating} precision={0.5} size= "small" readOnly />
                    </div>
                </React.Fragment>
            }
            placement="right"
            arrow
        >
            {children}
        </HtmlTooltip>
    );
};

export default BookSlotTooltip;