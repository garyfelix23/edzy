import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../services/api.js';
import './Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();
    // getting token(to get current user's enrolled course) and name(display in dashboard) from localstorage
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // if not logged in, redirect to login
        if (!token) {
            navigate('/login');
            return;
        }

        getDashboard()
            .then(data => {
                // to check if the data is Array
                if (Array.isArray(data)) {
                    setCourses(data);
                }
            })
            .catch(err => console.error('Dashboard load failed:', err))
            .finally(() => setLoading(false));
    }, [token, navigate]); // it runs based on the token which generated when user logged in

    // calculate stats from enrolled courses
    const completed = courses.filter(c => c.completed).length;
    const inProgress = courses.filter(c => c.progress > 0 && !c.completed).length;
    // const notStarted = courses.filter(c => c.progress === 0).length;
    // overall percentage
    const overall = courses.length > 0
        ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
        : 0;

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="dashboard-page">

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {name}! 👋</h1>
                    <p>Track your learning progress and continue where you left off.</p>
                </div>
                <button
                    className="btn-browse"
                    onClick={() => navigate('/courses')}
                >
                    + Browse More Courses
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card stat-blue">
                    <div className="stat-number">{courses.length}</div>
                    <div className="stat-label">Total Enrolled</div>
                </div>
                <div className="stat-card stat-green">
                    <div className="stat-number">{completed}</div>
                    <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card stat-yellow">
                    <div className="stat-number">{inProgress}</div>
                    <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card stat-purple">
                    <div className="stat-number">{overall}%</div>
                    <div className="stat-label">Overall Progress</div>
                </div>
            </div>

            {/* Course List */}
            <h2 className="section-title">My Courses</h2>

            {courses.length === 0 ? (
                <div className="empty-dashboard">
                    <span>📚</span>
                    <p>You haven't enrolled in any courses yet.</p>
                    <button onClick={() => navigate('/courses')}>
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div className="dashboard-courses">
                    {courses.map(course => (
                        <div
                            key={course.courseId}
                            className="dashboard-course-card"
                            onClick={() => navigate(`/courses/${course.courseId}`)}
                        >
                            <div className="dc-left">
                                {/* Status icon */}
                                <div className="dc-icon">
                                    {course.completed
                                        ? '✅'
                                        : course.progress > 0
                                            ? '📖'
                                            : '📚'}
                                </div>

                                <div className="dc-info">
                                    <h3>{course.title}</h3>

                                    {/* Status badge */}
                                    <div className="dc-status">
                                        {course.completed
                                            ? <span className="status-completed">Completed</span>
                                            : course.progress > 0
                                                ? <span className="status-progress">In Progress</span>
                                                : <span className="status-notstarted">Not Started</span>
                                        }
                                    </div>

                                    {/* Progress bar */}
                                    <div className="dc-progress-bar">
                                        <div
                                            className={`dc-progress-fill ${course.completed ? 'fill-green' : ''}`}
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="dc-right">
                                <span className="dc-percent">{course.progress}%</span>
                                <span className="dc-arrow">›</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;