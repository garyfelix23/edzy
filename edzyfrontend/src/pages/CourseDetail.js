import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, enrollCourse, getMyEnrollments, updateProgress } from '../services/api.js';
import './CourseDetail.css';

function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // gettting token from localstorage to see if user logged in or not

    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');  // for success message

    // converts youtube link to embed link & used in iframe to play video
    const getEmbedUrl = (url) => {
        if (!url) return '';
        // url is split wherever "v=" appears (e.g., "https://www.youtube.com/watch?v=abc123&list=xyz")
        const videoId = url.split('v=')[1]?.split('&')[0]; // after spliting, takes the 1st index, which is abc123
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    // this useEffect runs when id changes (user opens different course) & token changes (user logs in or out)
    useEffect(() => {
        getCourseById(id)
            .then(data => setCourse(data))
            .catch(err => console.error('Failed to load course:', err))
            .finally(() => setLoading(false));

        // if user logged in, then fetching the user enrolled courses
        if (token) {
            getMyEnrollments()
                .then(enrollments => {
                    // to ensure the res data is array
                    if (Array.isArray(enrollments)) {
                        // based on the course ID, finding the enrollments
                        const found = enrollments.find(e => e.courseId === id);
                        if (found) setEnrollment(found);
                    }
                })
                .catch(err => console.error('Failed to load enrollments:', err));
        }
    }, [id, token]); // id and token used because, the enrollment api runs based on courseId query param and token

    // start learning button function
    const handleStartLearning = async () => {
        // if user not logged in, then redirected to the login page
        if (!token) {
            localStorage.setItem('redirect', `/courses/${id}`);
            navigate('/login');
            return;
        }
        // else, if logged in, then making enrolling true. means user enrolled in the course
        setEnrolling(true);
        try {
            // passing the course id to enrollCourse function in api.js
            const data = await enrollCourse(id);
            if (data.id) {
                setEnrollment(data);
                setMessage('Successfully enrolled! Start learning below.');
            }
        } catch (err) {
            console.error('Enrollment failed:', err);
        } finally {
            setEnrolling(false);
        }
    };

    // progress update button function
    const handleProgress = async (percent) => {
        if (!enrollment) return;
        setUpdating(true);
        try {
            // passing the enrollment id and percent which user clicks in the UI to the updateProgress API 
            const data = await updateProgress(enrollment.id, percent);
            setEnrollment(data);
            // only when user progress to 100%, the course is completed and that completed will turn true if 100%
            setMessage(data.completed
                ? '🎉 Course completed! Congratulations!'
                : `Progress updated to ${data.progressPercentage}%`
            );
        } catch (err) {
            console.error('Progress update failed:', err);
        } finally {
            setUpdating(false);
            // set timeout is used to show the success message for specific seconds. 
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <div className="loading">Loading course...</div>;
    if (!course) return <div className="loading">Course not found.</div>;

    return (
        <div className="course-detail-page">

            {/* Back button */}
            <button className="back-btn" onClick={() => navigate('/courses')}>
                ← Back to Courses
            </button>

            <div className="course-detail-layout">
                {/* left side */}
                <div className="course-detail-left">
                    {enrollment && course.videoLink ? (
                        // Enrolled — show video player
                        <div className="video-wrapper">
                            <iframe
                                src={getEmbedUrl(course.videoLink)}
                                title={course.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        // Not enrolled — show course image with lock
                        <div className="image-wrapper">
                            <img
                                src={course.imageLink || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80'}
                                alt={course.title}
                                className="detail-image"
                            />
                            {!enrollment && (
                                <div className="image-overlay">
                                    <span>🔒</span>
                                    <p>Enroll to unlock video</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Course meta info below video */}
                    <div className="course-meta-below">
                        <span className="detail-category">{course.category}</span>
                        <h1 className="detail-title">{course.title}</h1>

                        <div className="detail-tags">
                            {course.tags?.map(tag => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>

                        <p className="detail-desc">{course.description}</p>

                        <div className="detail-instructor">
                            <div className="instructor-avatar">
                                {course.instructorName?.charAt(0) || course.instructor?.charAt(0)}
                            </div>
                            <div>
                                <div className="instructor-label">Instructor</div>
                                <div className="instructor-name">
                                    {course.instructorName || course.instructor}
                                </div>
                            </div>
                        </div>

                        <div className="detail-meta-row">
                            {course.duration && (
                                <span className="meta-pill">⏱ {course.duration}</span>
                            )}
                        </div>
                    </div>
                </div>
                {/* Right side */}
                <div className="course-detail-right">
                    <div className="detail-card">
                        {!enrollment ? (
                            // Not enrolled
                            <div className="enroll-section">
                                <img
                                    src={course.imageLink || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80'}
                                    alt={course.title}
                                    className="card-thumbnail"
                                />
                                <h3>Start Learning Today</h3>
                                <p>Enroll now to track your progress and unlock the video.</p>
                                <button
                                    className="btn-start-learning"
                                    onClick={handleStartLearning}
                                    disabled={enrolling}
                                >
                                    {enrolling
                                        ? 'Enrolling...'
                                        : token
                                            ? '🚀 Start Learning'
                                            : '🔒 Login to Start'}
                                </button>
                            </div>
                        ) : (
                            // Enrolled — show progress
                            <div className="progress-section">
                                <h3>Your Progress</h3>

                                {/* Circle progress indicator */}
                                <div className="progress-circle-wrapper">
                                    <svg viewBox="0 0 100 100" className="progress-circle">
                                        <circle
                                            cx="50" cy="50" r="42"
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="10"
                                        />
                                        <circle
                                            cx="50" cy="50" r="42"
                                            fill="none"
                                            stroke={enrollment.completed ? '#22c55e' : '#ff0000'}
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 42}`}
                                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - enrollment.progressPercentage / 100)}`}
                                            transform="rotate(-90 50 50)"
                                            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                                        />
                                        <text
                                            x="50" y="50"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="circle-text"
                                        >
                                            {enrollment.progressPercentage}%
                                        </text>
                                    </svg>
                                </div>

                                {enrollment.completed && (
                                    <div className="completed-banner">
                                        Course Completed!
                                    </div>
                                )}

                                {/* Progress bar */}
                                <div className="progress-bar-container">
                                    <div
                                        className={`progress-bar-fill ${enrollment.completed ? 'completed' : ''}`}
                                        style={{ width: `${enrollment.progressPercentage}%` }}
                                    />
                                </div>

                                {/* Quick buttons */}
                                <p className="progress-label">Update Progress:</p>
                                <div className="progress-buttons">
                                    {[25, 50, 75, 100].map(p => (
                                        <button
                                            key={p}
                                            className={`progress-btn ${enrollment.progressPercentage >= p ? 'progress-btn-done' : ''}`}
                                            onClick={() => handleProgress(p)}
                                            disabled={updating || enrollment.progressPercentage >= p}
                                        >
                                            {p}%
                                        </button>
                                    ))}
                                </div>

                                {message && (
                                    <div className="progress-message">{message}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetail;