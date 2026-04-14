import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api.js';
import './Auth.css';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginUser(formData);

            if (data.token) {
                // save user details to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('name', data.name);
                // localStorage.setItem('email', data.email);
                localStorage.setItem('role', data.role); 

                if (data.role === 'INSTRUCTOR'){
                    localStorage.removeItem('redirect');
                    navigate('/instructor');
                } else {
                    const redirect = localStorage.getItem('redirect');
                    if (redirect) {
                        localStorage.removeItem('redirect');
                        navigate(redirect);
                    } else{
                        navigate('/');
                    }
                }

                // check if user was redirected from a course page
                const redirect = localStorage.getItem('redirect');
                if (redirect) {
                    localStorage.removeItem('redirect');
                    navigate(redirect);
                } else {
                    navigate('/');
                }
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Login to continue learning</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button
                    type="submit"
                    className="login-btn"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="form-footer">
                Don't have an account?{' '}
                <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;