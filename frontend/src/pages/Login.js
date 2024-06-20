import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    return (
        <div className='LandingPage'>
            <div className='login-page-container'>
                <div className='company-logo'>
                    <Link to="/"><img src="/logo.png" alt='logo'></img></Link>
                </div>
                <div className='app-intro'>
                    
                </div>
                <div className='form-card'>

                </div>
            </div>
            <div className='about-section'>

            </div>
        </div>
        
        
    );
}

export default Login;
