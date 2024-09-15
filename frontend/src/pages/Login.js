import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../styles/Login.css';

const Login = ({ setIsAuthenticated }) => {
    return (
        <div className='LandingPage'>
            <div className='login-page-container'>
                <LoginForm setIsAuthenticated={setIsAuthenticated} />
            </div>
            {/* <AboutSection /> */}
        </div>
    );
}

export default Login;

/*
<div className='company-logo'>
                <Link to="/login">
                    <img src="/logo.png" alt='logo' />
                </Link>
            </div>
*/