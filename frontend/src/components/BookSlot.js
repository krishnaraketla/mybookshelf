import React, { useState } from 'react';
import '../styles/BookSlot.css'; 
import { useNavigate } from 'react-router-dom';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const BookSlot = ({ book }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip 
            {...props} 
            classes={{ popper: className }} 
            enterDelay={2000} // Delay before the tooltip appears
        />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            width: '220px', // Fixed width
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
            overflow: 'hidden', // Ensure content doesn't overflow
        },
    }));

    const navigate = useNavigate();

    const handleSeeMore = (e) => {
        e.stopPropagation(); // Prevent tooltip from closing
        setShowFullDescription(!showFullDescription);
    };

    const renderDescription = () => {
        const maxLength = 500; // Maximum characters before showing "See More"
        const description = book.description || "No description available";
        if (description.length > maxLength && !showFullDescription) {
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
                {description.length > maxLength && (
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

    if (!book) {
        return (
            <div className='book-slot'>
                {/* Add any content or styling for an empty slot */}
            </div>
        );
    }

    return (
        <HtmlTooltip
            title={
                <React.Fragment>
                    <strong>{book.title || "No Title Available"}</strong>
                    <p>{renderDescription()}</p>
                    <em>{`Rating: ${book.averageRating || "N/A"}`}</em>
                </React.Fragment>
            }
            placement="right"
            arrow
        >
            <div className='book-slot'>
                {book && book.googleId ? (
                    <img 
                        src={book.image} 
                        alt="Book Cover" 
                        onClick={() => { 
                            localStorage.setItem("bookDetail", JSON.stringify(book));
                            navigate(`/books/${book.googleId}`);
                        }} 
                        onError={(e) => { console.log(e); }}
                    />
                ) : null}
            </div>
        </HtmlTooltip>
    );
}

export default BookSlot;