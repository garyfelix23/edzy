import React from 'react';
import {Link, useNavigate} from 'react-router-dom'; 
import './Navbar.css';

function Navbar(){
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    // const name = localStorage.getItem('name');
    const role = localStorage.getItem('role'); 

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className='navbar'>
            <div className="nav-left">
                <Link to="/" className="navbar-brand">
                    <span className="logo-text">Edzy</span>
                </Link>
            </div>
            <div className="nav-right">
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/courses" className="nav-link">Courses</Link>

                    {token ? (
                        <>
                            {/* USER Dashboard */}
                            {role === 'STUDENT' && (
                                <Link to="/dashboard" className="nav-link">
                                    Dashboard
                                </Link>
                            )}
                            {/* INSTRUCTOR Dashboard */}
                            {role === 'INSTRUCTOR' && (
                                <>
                                    <Link to="/instructor" className='nav-link'>
                                        My Course
                                    </Link>
                                    <Link to="/instructor/add-course" className='nav-link'>
                                        Add Course
                                    </Link>
                                </>
                            )}
                            <button onClick={handleLogout} className="btn-logout">
                                Logout
                            </button>
                        </>
                    ):(
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn-register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;