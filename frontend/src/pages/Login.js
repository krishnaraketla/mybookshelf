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
                    {/* You can add any introductory text here */}
                </div>
                <div className='form-card'>
                    <h2>LOGIN HERE</h2>
                    <form>
                        <div className='form-group'>
                            <label htmlFor='username'>Username</label>
                            <input type='text' id='username' name='username' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' id='password' name='password' />
                        </div>
                        <button type='submit' className='sign-in-button'>SIGN IN</button>
                        <p className='sign-up-link'>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </form>
                </div>
            </div>
            <div className='about-section'>
                {/* You can add any additional content here */}
            </div>
        </div>
    );
}

export default Login;
