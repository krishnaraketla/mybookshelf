import React, { useState, useEffect } from 'react';
import '../styles/BookShelf.css'; 
import BookRow from './BookRow';

const BookShelf = ({ shelfName }) => {
    const [books, setBooks] = useState([]);
    const [shelves, setShelves] = useState([])
    const [row1, setRow1] = useState([]);
    const [row2, setRow2] = useState([]);
    const [row3, setRow3] = useState([]);

    const fetchShelves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/shelves', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            });
            if (response.ok) {
                const data = await response.json();
                setShelves(data);
            } else {
                console.log("Error fetching shelves");
            }
        } catch (error) {
            console.log("Error fetching shelves");
        }
    };

    useEffect(() => {
        fetchAllBooks();
    },[shelves])

    const fetchAllBooks = async () => {
        let shelfUrl = ""
        for(let shelf of shelves)
        {   
            if(shelfName === "Currently Reading")
            {
                if(shelf.name === "reading")
                {
                    shelfUrl = shelf.url;
                    console.log(shelfUrl)
                    break;
                }
            }
            if(shelfName === "Finsihed Reading")
            {
                if(shelf.name === "finshed")
                {
                    shelfUrl = shelf.url;
                    console.log(shelfUrl)
                    break;
                }
            }
            if(shelfName === "To be read")
            {
                if(shelf.name === "tbr")
                {
                    shelfUrl = shelf.url;
                    console.log(shelfUrl)
                    break;
                }
            }
        }
        try {
            const token = localStorage.getItem('token');
            let response = null
            // `http://localhost:4000/shelves/665d2ee5bcf374e52c9178a6/books`
            if(shelfUrl === "")
            {
                response = null
            }
            else{
                console.log(`http://localhost:4000${shelfUrl}`)
                response = await fetch(`http://localhost:4000${shelfUrl}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });
            }

            if (response && response.ok) {
                const data = await response.json();
                setBooks(data);
            } else {
                console.log("Book not found");
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        fetchShelves();
    }, [shelfName]);

    useEffect(() => {
        const row1Books = [];
        const row2Books = [];
        const row3Books = [];

        for (let i = 0; i < books.length; i++) {
            if (i >= 9) break;
            if (i < 3) {
                row1Books.push(books[i]);
            } else if (i < 6) {
                row2Books.push(books[i]);
            } else {
                row3Books.push(books[i]);
            }
        }

        setRow1(row1Books);
        setRow2(row2Books);
        setRow3(row3Books);
    }, [books]);

    return (
        <div className='book-shelf'>
            <h1>{shelfName}</h1>
            <BookRow books={row1} />
            <BookRow books={row2} />
            <BookRow books={row3} />
            <div className="navigation-arrows">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="rgba(237, 238, 213, 0.5)" className="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="rgba(237, 238, 213, 0.5)" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
        </div>
    );
}

export default BookShelf;
