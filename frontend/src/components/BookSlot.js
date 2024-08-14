import React, { useEffect } from 'react';
import '../styles/BookSlot.css'; 
import { useNavigate } from 'react-router-dom';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const BookSlot = ({ book }) => {
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
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));

    const navigate = useNavigate();

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
                    <p>{book.description || "No description available"}</p>
                    <em>{`Rating: ${book.rating || "N/A"}`}</em>
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