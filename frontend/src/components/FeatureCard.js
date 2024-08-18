import React from 'react';
import '../styles/FeatureCard.css'; 

const FeatureCard = ({ illustrationClass, title, description }) => {
    return (
        <div className="feature-card">
            <div className="illustration-box"> 
                <div className={`illustration ${illustrationClass}`}></div>
            </div>
            <div className="feature-description-box">
                <h3 className='feature-title'>{title}</h3>
                <div className='feature-description'>{description}</div>
            </div>
        </div>
    );
}

export default FeatureCard;