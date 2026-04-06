import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api.js';
import './Auth.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
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
        const data = await registerUser(formData);

        if (data.token) {
            navigate('/login');
        } else {
            setError(data.message || 'Registration failed. Try again.');
        }
    } catch (err) {
        setError('Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="form-container">
            <h2>Create Account</h2>
            <p className="form-subtitle">Start your learning journey today</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Gary Felix"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="gary@example.com"
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
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button
                    type="submit"
                    // className="btn-primary btn-full"
                    className="login-btn"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>

            <p className="form-footer">
                Already have an account?{' '}
                <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default Register;