import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCourses } from '../services/api';
import './Home.css';

function Home() {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        getAllCourses()
            .then(data => {
                if (Array.isArray(data)) setCourses(data.slice(0, 3));
            })
            .catch(err => console.error('Failed to load courses:', err));
    }, []);

    const features = [
        { icon: '🎯', title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience.' },
        { icon: '📱', title: 'Learn Anywhere', desc: 'Access your courses from any device, anytime you want.' },
        { icon: '📈', title: 'Track Progress', desc: 'Monitor your learning journey with detailed progress tracking.' },
        { icon: '🏆', title: 'Earn Certificates', desc: 'Complete courses and earn certificates to boost your career.' },
    ];

    const stats = [
        { value: '5+', label: 'Courses' },
        { value: '10+', label: 'Students' },
        { value: '5+', label: 'Instructors' },
        { value: '95%', label: 'Satisfaction' },
    ];

    return (
        <div className="home">
            {/* Hero section */}
            <section className="hero">
                <div className="hero-left">
                    <span className="hero-badge">Start Learning Today</span>
                    <h1 className="hero-title">
                        Unlock Your <span className="hero-highlight">Potential</span>
                        <br />with Expert Courses
                    </h1>
                    <p className="hero-desc">
                        Join thousands of learners building real skills in
                        frontend, backend, cloud, and more. Learn at your
                        own pace with hands-on projects.
                    </p>
                    <div className="hero-actions">
                        <Link to="/courses" className="btn-primary-lg">
                            Browse Courses
                        </Link>
                        {!token && (
                            <Link to="/register" className="btn-outline-lg">
                                Join for Free
                            </Link>
                        )}
                        {token && (
                            <Link to="/dashboard" className="btn-outline-lg">
                                My Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Stats row */}
                    <div className="hero-stats">
                        {stats.map(s => (
                            <div key={s.label} className="stat-item">
                                <span className="stat-value">{s.value}</span>
                                <span className="stat-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero-right">
                    <div className="hero-image-wrapper">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                            alt="Students learning"
                            className="hero-image"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Why Choose <span className="highlight">Edzy?</span></h2>
                    <p>Everything you need to accelerate your learning journey</p>
                </div>
                <div className="features-grid">
                    {features.map(f => (
                        <div key={f.title} className="feature-card">
                            <div className="feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Courses */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Featured <span className="highlight">Courses</span></h2>
                    <p>Hand-picked courses to get you started</p>
                </div>

                {courses.length === 0 ? (
                    <div className="no-courses">No courses available yet.</div>
                ) : (
                    <div className="courses-grid">
                        {courses.map(course => (
                            <div
                                key={course.id}
                                className="course-card"
                                onClick={() => navigate(`/courses/${course.id}`)}
                            >
                                <div className="course-card-img-wrapper">
                                    <img
                                        src={course.imageLink || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80'}
                                        alt={course.title}
                                        className="course-card-img"
                                    />
                                    <span className="course-level-badge">{course.level}</span>
                                </div>
                                <div className="course-card-body">
                                    <span className="course-category">{course.category}</span>
                                    <h3 className="course-card-title">{course.title}</h3>
                                    <p className="course-card-desc">
                                        {course.description?.slice(0, 90)}...
                                    </p>
                                    <div className="course-card-footer">
                                        <span className="course-instructor">👤 {course.instructorName}</span>
                                        <span className="course-duration">⏱ {course.duration}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="view-all-wrapper">
                    <Link to="/courses" className="btn-primary-lg">
                        View All Courses →
                    </Link>
                </div>
            </section>

            {/* CTA Section - this section is shown only when user not logged in */}
            {!token && (
                <section className="cta-section">
                    <h2 className="cta-h2">Ready to Start Learning?</h2>
                    <p>Join thousands of students already on their learning journey</p>
                    <div className="cta-actions">
                        <Link to="/register" className="btn-primary-lg">
                            Get Started Free
                        </Link>
                        <Link to="/courses" className="btn-outline-lg btn-outline-white">
                            Browse Courses
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Home;