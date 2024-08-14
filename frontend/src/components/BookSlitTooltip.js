import React, { useState } from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

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
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            width: '220px', // Fixed width
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
            overflow: 'hidden',
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: '#bbb', // Match arrow color with the tooltip background
        },
    }));

    const handleSeeMore = (e) => {
        e.stopPropagation(); // Prevent the tooltip from closing
        setShowFullDescription(!showFullDescription);
    };

    const renderDescription = () => {
        const maxLength = 100; // Maximum characters before showing "See More"
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
                    <em>{`Rating: ${rating || "N/A"}`}</em>
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