import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../styles/Login.css';
import About from '../components/AboutSection';

const Login = ({setIsAuthenticated}) => {
    return (
        <div className='LandingPage'>
            <div className='login-page-container'>
                <div className='company-logo'>
                    <Link to="/login"><img src="/logo.png" alt='logo'></img></Link>
                </div>
                <LoginForm setIsAuthenticated={setIsAuthenticated} />
            </div>
        </div>
    );
}

export default Login;
