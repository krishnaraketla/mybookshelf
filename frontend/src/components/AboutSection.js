import React from 'react';
import FeatureCard from "./FeatureCard";
import '../styles/AboutSection.css'; 
import NavBar from "./NavBar";

const AboutSection = () => {
    return (
        <div className="about-section">
            <div className='feature-card-wrapper'>
                <div className="features-container">
                    <FeatureCard 
                        illustrationClass="manage-shelves"
                        description="Manage your bookshelves with ease. Organize books into categories like Reading, TBR, and Finished."
                    />
                    <FeatureCard 
                        illustrationClass="personalized-recommendations"
                        description="Get personalized book recommendations based on your ratings and reading history."
                    />
                    <FeatureCard 
                        illustrationClass="explore-bestsellers"
                        description="Explore bestsellers and discover new reads from various genres."
                    />
                    <FeatureCard 
                        illustrationClass="rate-review-books"
                        description="Rate and review books to share your thoughts and help others find great reads."
                    />
                    <FeatureCard 
                        illustrationClass="discover-new-authors"
                        description="Discover new authors and expand your reading horizons with lesser-known gems."
                    />
                </div>
            </div>
            
        </div>
    );
}

export default AboutSection;