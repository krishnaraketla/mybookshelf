import React, { useState, useEffect } from 'react';
import '../styles/BookShelf.css'; 
import BookRow from './BookRow';

const BookShelf = ({ shelfName }) => {
    const [books, setBooks] = useState([]);
    const [shelves, setShelves] = useState([])
    const [row1, setRow1] = useState([]);
    const [row2, setRow2] = useState([]);
    const [row3, setRow3] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

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
                    break;
                }
            }
            if(shelfName === "Finished Reading")
            {
                if(shelf.name === "finished")
                {
                    shelfUrl = shelf.url;
                    break;
                }
            }
            if(shelfName === "To Be Read")
            {
                if(shelf.name === "tbr")
                {
                    shelfUrl = shelf.url;
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

            }
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const setRows = (page) => {
        let numPages = 1;
        if(page<1){
            setCurrentPage(1)
            return;
        }
        if(books.length <= 9){
            numPages = 1;
        }
        else{
            numPages = Math.floor(books.length/9) + 1;
        }
        if(page > numPages){
            setCurrentPage(numPages)
            return;
        }
        const booksPerPage = 9;
        const startIndex = (page - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
    
        const pageBooks = books.slice(startIndex, endIndex);
    
        const row1Books = [];
        const row2Books = [];
        const row3Books = [];
    
        for (let i = 0; i < pageBooks.length; i++) {
            if (i < 3) {
                row1Books.push(pageBooks[i]);
            } else if (i < 6) {
                row2Books.push(pageBooks[i]);
            } else {
                row3Books.push(pageBooks[i]);
            }
        }
    
        setRow1(row1Books);
        setRow2(row2Books);
        setRow3(row3Books);
    };


    useEffect(() => {
        fetchShelves();
    }, [shelfName]);

    useEffect(() => {
        setRows(currentPage)
    }, [books, currentPage]);

    return (
        <div className='book-shelf'>
            <h1>{shelfName}</h1>
            <BookRow books={row1} />
            <BookRow books={row2} />
            <BookRow books={row3} />
            <div className="navigation-arrows">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="rgba(237, 238, 213, 0.5)" className="bi bi-chevron-left" viewBox="0 0 16 16" onClick={() => {setCurrentPage(currentPage - 1)}}>
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="rgba(237, 238, 213, 0.5)" className="bi bi-chevron-right" viewBox="0 0 16 16" onClick={() => {setCurrentPage(currentPage + 1)}}>
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
        </div>
    );
}

export default BookShelf;
