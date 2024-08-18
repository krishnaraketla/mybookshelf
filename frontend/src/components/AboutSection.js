import React from 'react';
import FeatureCard from "./FeatureCard";
import '../styles/AboutSection.css'; 

const AboutSection = () => {
    return (
        <div className="about-section">
            <div className="hero-section">
                <h1>About MyBookshelf</h1>
                <p>Discover, organize, and share your reading journey with MyBookshelf.</p>
            </div>
            <h2>Unlock Your Reading Experience</h2>
            <div className='feature-card-wrapper'>
                <div className="features-container">
                    <FeatureCard 
                        illustrationClass="manage-shelves"
                        title="Manage Shelves"
                        description="Organize your books into categories like Reading, To Be Read, and Finished."
                    />
                    <FeatureCard 
                        illustrationClass="personalized-recommendations"
                        title="Personalized Recommendations"
                        description="Get book suggestions based on your reading habits and preferences."
                    />
                    <FeatureCard 
                        illustrationClass="explore-bestsellers"
                        title="Explore Bestsellers"
                        description="Stay updated with the latest bestsellers across various genres."
                    />
                    <FeatureCard 
                        illustrationClass="rate-review-books"
                        title="Rate and Review"
                        description="Share your opinions by rating and reviewing the books you've read."
                    />
                    <FeatureCard 
                        illustrationClass="discover-new-authors"
                        title="Discover New Authors"
                        description="Find hidden gems and discover new authors that match your taste."
                    />
                    <FeatureCard 
                        illustrationClass="share-shelves"
                        title="Share Personalized Shelves"
                        description="Easily share your personalized bookshelves with friends, just like sharing a playlist. Let others explore your curated collection of books and discover new favorites together."
                    />
                </div>
            </div>
        </div>
    );
}

export default AboutSection;