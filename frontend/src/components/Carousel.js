import React, { useState, useEffect, useRef } from 'react';
import '../styles/Carousel.css';

const Carousel = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [carouselHeight, setCarouselHeight] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? React.Children.count(children) - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === React.Children.count(children) - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (carouselRef.current) {
      setCarouselHeight(carouselRef.current.clientHeight);
    }
  }, []);

  return (
    <div className="carousel" style={{ height: carouselHeight }}>
      <button className="carousel-button" onClick={prevSlide}>
        &#10094;
      </button>
      <div
        className="carousel-content"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        ref={carouselRef}
      >
        {React.Children.map(children, (child, index) => (
          <div className="carousel-item" key={index}>
            {child}
          </div>
        ))}
      </div>
      <button className="carousel-button" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
