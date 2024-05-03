import React from 'react';
import NavBar from '../components/NavBar';
import './Login.css'; // Ensure you have a CSS file for styling

const Login = () => {
    return (
        <div>
            <NavBar />
            <div className="login-container">
                <div className="form-container">
                    <h2>CREATE NEW ACCOUNT</h2>
                    <form className="login-form">
                        <input type="text" placeholder="Name" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button type="submit">SIGN UP</button>
                        <p className="login-link">Already registered? <a href="login">Login</a></p>
                    </form>
                </div>
            </div>
        </div>
        
    );
}

export default Login;
