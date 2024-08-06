import '../styles/FeatureCard.css'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginForm = ({setIsAuthenticated}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login` , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
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
    );
}

export default LoginForm;
