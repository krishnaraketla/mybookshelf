import React, { useState } from 'react';
//import './Dropdown.css'; // Make sure to create and reference the CSS for styling

const Dropdown = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="dropdown-container">
            <input type="text" onClick={toggleDropdown} placeholder="Search..." />
            {isOpen && (
                <ul className="dropdown-list">
                    {items.map((item, index) => (
                        <li key={index} onClick={() => {
                            console.log(item.label); // Example action
                            setIsOpen(false);
                        }}>
                            <img src={item.image} alt={item.label} />
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
