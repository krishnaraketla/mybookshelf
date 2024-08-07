import '../styles/LoginForm.css'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginForm = ({setIsAuthenticated}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
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

    const handleSignup = async (event) => {
        event.preventDefault();
        // Add your signup logic here
    };

    return (
      <div className={`card ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="card-inner">
              <div className="card-face card-face-front">
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
                          <p className='sign-up-link'>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); console.log("clicked!"); setIsFlipped(true); }}>Sign up</a></p>
                      </form>
                  </div>
              </div>
              <div className="card-face card-face-back">
                  <div className='form-card'>
                      <h2>SIGN UP</h2>
                      <form onSubmit={handleSignup}>
                          <div className='form-group'>
                              <label htmlFor='email'>Email</label>
                              <input type='email' id='email' name='email' onChange={(e) => setEmail(e.target.value)}/>
                          </div>
                          <div className='form-group'>
                              <label htmlFor='newUsername'>Username</label>
                              <input type='text' id='newUsername' name='newUsername' onChange={(e) => setUsername(e.target.value)}/>
                          </div>
                          <div className='form-group'>
                              <label htmlFor='newPassword'>Password</label>
                              <input type='password' id='newPassword' name='newPassword' onChange={(e) => setPassword(e.target.value)}/>
                          </div>
                          <div className='form-group'>
                              <button type='submit'>SIGN UP</button>
                          </div>
                          <p className='sign-up-link'>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); console.log("clicked!"); setIsFlipped(false); }}>Log in</a></p>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default LoginForm;
