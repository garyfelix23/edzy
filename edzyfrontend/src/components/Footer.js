import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { getAllCourses } from '../services/api';

function Footer() {

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        getAllCourses
        .then((data) => {
            if(Array.isArray(data)){
                setCourses(data);
            }
        })
        .c
    }, []);

    return (
        <footer className="footer">
            <div className="footer-inner">

                <div className="footer-brand">
                    <div className="footer-logo">Edzy</div>
                    <p className="footer-tagline">
                        Learn at your own pace. Build real skills.
                        Grow your career with expert-led courses.
                    </p>
                </div>

                <div className="footer-links-group">
                    <h4>Platform</h4>
                    <Link to="/">Home</Link>
                    <Link to="/courses">Courses</Link>
                    <Link to="/dashboard">Dashboard</Link>
                </div>

                <div className="footer-links-group">
                    <h4>Categories</h4>
                    <span>Frontend</span>
                    <span>Backend</span>
                    <span>Database</span>
                    <span>DevOps</span>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Edzy. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;