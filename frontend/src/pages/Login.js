import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import About from '../components/About';

const Login = ({setIsAuthenticated}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const response = await fetch(`http://localhost:${process.env.PORT}/auth/login` , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
    
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          setIsAuthenticated(true);
          navigate('/');
        } else {
          alert('Login failed');
        }
      };


    return (
        <div className='LandingPage'>
            <div className='login-page-container'>
                <div className='company-logo'>
                    <Link to="/login"><img src="/logo.png" alt='logo'></img></Link>
                </div>
                <div className='app-intro'>
                    {/* You can add any introductory text here */}
                </div>
                <div className='form-card'>
                    <h2>LOGIN HERE</h2>
                    <form onSubmit={handleLogin}>
                        <div className='form-group'>
                            <label htmlFor='username'>Username</label>
                            <input type='text' id='username' name='username' onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password'>Password</label>
                            <input type='password' id='password' name='password' onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className='form-group'>
                            <button type='submit'>SIGN IN</button>
                        </div>
                        <p className='sign-up-link'>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </form>
                </div>
            </div>
            <div className='about-section'>
                <About />
            </div>
        </div>
    );
}

export default Login;
