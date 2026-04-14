import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {

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
            </div>

            <div className="footer-bottom">
                <p>© 2026 Edzy. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;