import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api.js';
import './styles/Auth.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'  // default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // when user updates the form fields, this function works
    const handleChange = (e) => {
        // adding data with the existing formData
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // this function works when user submits the form
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
                        placeholder="Example"
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
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Role Selection */}
                <div className='form-group'>
                    <label>I am a</label>
                    <div className='role-selector'>
                        <div className={`role-option ${formData.role === 'STUDENT' ? 'role-active' : ''}`}
                            onClick={() => setFormData({...formData, role: 'STUDENT'})}
                        >
                            <span className="role-label">Student</span>
                            <span className="role-desc">I want to learn</span>
                        </div>
                        <div
                            className={`role-option ${formData.role === 'INSTRUCTOR' ? 'role-active' : ''}`}
                            onClick={() => setFormData({ ...formData, role: 'INSTRUCTOR' })}
                        >
                            <span className="role-label">Instructor</span>
                            <span className="role-desc">I want to teach</span>
                        </div>
                    </div>
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