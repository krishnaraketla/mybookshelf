import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import NavBar from '../components/NavBar';
import '../styles/Login.css';

const Login = ({ setIsAuthenticated }) => {
    return (
        <>
        <NavBar showRightLinks={false} />
        <div className='LandingPage'>
            <div className='login-page-container'>
                <LoginForm setIsAuthenticated={setIsAuthenticated} />
            </div>
            {/* <AboutSection /> */}
        </div>
        </>
    );
}

export default Login;