import React from 'react';
import '../styles/BookCover.css';

const BookCover = ({ book, edition, className }) => {
  const coverAvailable =
    edition?.coverIDs?.length > 0 || (edition?.isbn && edition.isbn.length > 0);

  const coverURL = edition?.coverIDs?.length > 0
    ? `https://covers.openlibrary.org/b/id/${edition.coverIDs[0]}-L.jpg`
    : edition?.isbn?.length > 0
    ? `https://covers.openlibrary.org/b/isbn/${edition.isbn[0]}-L.jpg`
    : null;

  return (
    <div className={`book-cover ${className}`}>
      <div className="placeholder">
        <span>{book.title}</span>
      </div>
      {coverAvailable && coverURL && (
        <img
          src={coverURL}
          alt={book.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
      )}
    </div>
  );
};

export default BookCover;
