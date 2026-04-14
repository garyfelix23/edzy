import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, enrollCourse, getMyEnrollments, completeModule, updateProgress } from '../services/api.js';
import './CourseDetail.css';

function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // gettting token from localstorage to see if user logged in or not
    const role = localStorage.getItem('role');

    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    // const [updating, setUpdating] = useState(false);
    const [activeModule, setActiveModule] = useState(null);
    const [completing, setCompleting] = useState(false);
    const [message, setMessage] = useState('');  // for success message

    // converts youtube link to embed link & used in iframe to play video
    const getEmbedUrl = (url) => {
        if (!url) return '';
        // url is split wherever "v=" appears (e.g., "https://www.youtube.com/watch?v=abc123&list=xyz")
        const videoId = url.split('v=')[1]?.split('&')[0]; // after spliting, takes the 1st index, which is abc123
        return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : url;
    };

    const hasModules = course?.modules && course.modules.length > 0;

    useEffect(() => {
        getCourseById(id)
            .then(data => {
                setCourse(data);
                if (data.modules && data.modules.length > 0) {
                    setActiveModule(data.modules[0]);
                }
            })
            .catch(err => console.error('Failed to load course:', err))
            .finally(() => setLoading(false));

        if (token) {
            getMyEnrollments()
                .then(enrollments => {
                    console.log('Enrollments loaded:', enrollments); // ← add this
                    if (Array.isArray(enrollments)) {
                        const found = enrollments.find(e => e.courseId === id);
                        console.log('Found enrollment:', found);     // ← add this
                        if (found) setEnrollment(found);
                    }
                })
                .catch(err => console.error('Failed to load enrollments:', err));
        }
    }, [id]);   // ← remove 'token' from dependencies, only re-run when id changes

    // start learning button function
    const handleStartLearning = async () => {
        // if user not logged in, then redirected to the login page
        if (!token) {
            localStorage.setItem('redirect', `/courses/${id}`);
            navigate('/login');
            return;
        }

        // Block instructor from enrolling a course
        if (role === 'INSTRUCTOR') {
            alert('Instructors cannot enroll in courses.');
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

    const handleCompleteModule = async (moduleId) => {
        if (!enrollment) return;

        console.log('Enrollment ID:', enrollment.id);        // ← check this
        console.log('Module ID:', moduleId);

        setCompleting(true);
        // try{
        //     const data = await completeModule(enrollment.id, moduleId);
        //     setEnrollment(data);
        //     setMessage(data.completed? 'Well Done! Course completed' : `Module Completed! Progress: ${data.progressPercentage}%`);
        //     setTimeout(() => setMessage(''), 3000);
        // } catch(err) {
        //     console.error('Module completion failed:', err);
        // } finally {
        //     setCompleting(false);
        // }
        try {
            const data = await completeModule(enrollment.id, moduleId);
            console.log('Response after complete:', data);    

            if (data.id) {
                setEnrollment(data);
                setMessage(data.completed
                    ? '🎉 Course completed! Congratulations!'
                    : `Module completed! Progress: ${data.progressPercentage}%`
                );
            } else {
                console.log('Error response:', data);         
            }
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Module completion failed:', err);
        } finally {
            setCompleting(false);
        }
    };

    // progress update button function
    const handleProgress = async (percent) => {
        if (!enrollment) return;
        try {
            // passing the enrollment id and percent which user clicks in the UI to the updateProgress API 
            const data = await updateProgress(enrollment.id, percent);
            setEnrollment(data);
            // only when user progress to 100%, the course is completed and that completed will turn true if 100%
            setMessage(data.completed
                ? '🎉 Course completed! Congratulations!'
                : `Progress updated to ${data.progressPercentage}%`
            );
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Progress update failed:', err);
        }
    };

    const isModuleCompleted = (moduleId) => {
        return enrollment?.completedModules?.includes(moduleId);
    }

    const canAccessModule = (index) => {
        if (index === 0) return true;

        // must complete previous module first
        const prevModule = course.modules[index - 1];
        // return isModuleCompleted(prevModule.moduleId);
        return enrollment?.completedModules?.includes(prevModule.moduleId);
    };

    if (loading) return <div className="loading">Loading course...</div>;
    if (!course) return <div className="loading">Course not found.</div>;

    return (
        <div className="course-detail-page">
            <button className="back-btn" onClick={() => navigate('/courses')}>
                ← Back to Courses
            </button>

            <div className="course-detail-layout">

                {/* Left Side */}
                <div className="course-detail-left">

                    {/* Video/Text Player */}
                    {enrollment && activeModule && role !== 'INSTRUCTOR' ? (
                        <div className="module-player">
                            {/* Video */}
                            {(activeModule.type === 'video' ||
                                activeModule.type === 'both') &&
                                activeModule.videoLink && (
                                    <div className="video-wrapper">
                                        <iframe
                                            src={getEmbedUrl(activeModule.videoLink)}
                                            title={activeModule.title}
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                            {/* Text content */}
                            {(activeModule.type === 'text' ||
                                activeModule.type === 'both') &&
                                activeModule.textContent && (
                                    <div className="text-content">
                                        <h3>📝 Reading Material</h3>
                                        <p>{activeModule.textContent}</p>
                                    </div>
                                )}

                            {/* Module title and complete button */}
                            <div className="module-player-footer">
                                <div>
                                    <h3 className="active-module-title">
                                        {activeModule.title}
                                    </h3>
                                    {activeModule.duration && (
                                        <span className="active-module-duration">
                                            ⏱ {activeModule.duration}
                                        </span>
                                    )}
                                </div>
                                {!isModuleCompleted(activeModule.moduleId) ? (
                                    <button
                                        className="btn-complete-module"
                                        onClick={() => handleCompleteModule(
                                            activeModule.moduleId
                                        )}
                                        disabled={completing}
                                    >
                                        {completing
                                            ? 'Saving...'
                                            : '✓ Mark as Complete'}
                                    </button>
                                ) : (
                                    <span className="module-done-badge">
                                        Completed
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : !enrollment && role !== 'INSTRUCTOR' ? (
                        // Not enrolled — show locked image
                        <div className="image-wrapper">
                            <img
                                src={course.imageLink ||
                                    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80'}
                                alt={course.title}
                                className="detail-image"
                            />
                            <div className="image-overlay">
                                <span>🔒</span>
                                <p>Enroll to unlock content</p>
                            </div>
                        </div>
                    ) : role === 'INSTRUCTOR' ? (
                        <div className="image-wrapper">
                            <img
                                src={course.imageLink ||
                                    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80'}
                                alt={course.title}
                                className="detail-image"
                            />
                        </div>
                    ) : null}

                    {/* Module List (for courses with modules) */}
                    {enrollment && hasModules && role !== 'INSTRUCTOR' && (
                        <div className="modules-sidebar">
                            <h3>Course Modules</h3>
                            <div className="modules-list-player">
                                {course.modules
                                    .sort((a, b) => a.order - b.order)
                                    .map((mod, index) => {
                                        const completed = isModuleCompleted(
                                            mod.moduleId
                                        );
                                        const accessible = canAccessModule(index);
                                        const isActive = activeModule?.moduleId
                                            === mod.moduleId;

                                        return (
                                            <div
                                                key={mod.moduleId}
                                                className={`module-row
                                                    ${isActive ? 'module-active' : ''}
                                                    ${completed ? 'module-completed' : ''}
                                                    ${!accessible ? 'module-locked' : ''}
                                                `}
                                                onClick={() => {
                                                    if (accessible) {
                                                        setActiveModule(mod);
                                                    }
                                                }}
                                            >
                                                <div className="module-row-icon">
                                                    {completed ? '✅' :
                                                        !accessible ? '🔒' :
                                                            isActive ? '▶' : '○'}
                                                </div>
                                                <div className="module-row-info">
                                                    <div className="module-row-title">
                                                        {mod.title}
                                                    </div>
                                                    <div className="module-row-meta">
                                                        <span className={`type-badge type-${mod.type}`}>
                                                            {mod.type === 'video'
                                                                ? '🎥'
                                                                : mod.type === 'text'
                                                                    ? '📝'
                                                                    : '🎥📝'}
                                                        </span>
                                                        {mod.duration && (
                                                            <span>{mod.duration}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Course Info */}
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
                                {(course.instructorName || course.instructor)?.charAt(0)}
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
                                <span className="meta-pill">
                                    ⏱ {course.duration}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="course-detail-right">
                    <div className="detail-card">
                        {role === 'INSTRUCTOR' ? (
                            <div className='enroll-section'>
                                <img
                                    src={course.imageLink ||
                                        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80'}
                                    alt={course.title}
                                    className="card-thumbnail"
                                />
                                <h3>Instructor View</h3>
                                <p>You are viewing this course as an instructor.</p>
                                <button
                                    className="btn-start-learning"
                                    onClick={() => navigate('/instructor')}
                                >
                                    Go to My Courses
                                </button>
                            </div>
                        ) : !enrollment ? (
                            <div className="enroll-section">
                                <img
                                    src={course.imageLink ||
                                        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80'}
                                    alt={course.title}
                                    className="card-thumbnail"
                                />
                                <h3>Start Learning Today</h3>
                                <p>
                                    Enroll now to unlock all
                                    {hasModules
                                        ? ` ${course.modules.length} modules`
                                        : ' content'
                                    } and track your progress.
                                </p>
                                <button
                                    className="btn-start-learning"
                                    onClick={handleStartLearning}
                                    disabled={enrolling}
                                >
                                    {enrolling ? 'Enrolling...' :
                                        token ? 'Start Learning' :
                                            '🔒 Login to Start'}
                                </button>
                            </div>
                        ) : (
                            <div className="progress-section">
                                <h3>Your Progress</h3>

                                {/* Circle progress */}
                                <div className="progress-circle-wrapper">
                                    <svg viewBox="0 0 100 100"
                                        className="progress-circle">
                                        <circle cx="50" cy="50" r="42"
                                            fill="none" stroke="#e5e7eb"
                                            strokeWidth="10" />
                                        <circle cx="50" cy="50" r="42"
                                            fill="none"
                                            stroke={enrollment.completed
                                                ? '#22c55e' : '#ff0000'}
                                            strokeWidth="10"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 42}`}
                                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - enrollment.progressPercentage / 100)}`}
                                            transform="rotate(-90 50 50)"
                                            style={{
                                                transition:
                                                    'stroke-dashoffset 0.6s ease'
                                            }}
                                        />
                                        <text x="50" y="50"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="circle-text">
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
                                        style={{
                                            width: `${enrollment.progressPercentage}%`
                                        }}
                                    />
                                </div>

                                {/* Module progress count */}
                                {hasModules && (
                                    <div className="module-count">
                                        {enrollment.completedModules?.length || 0}
                                        /{course.modules.length} modules completed
                                    </div>
                                )}

                                {/* Manual buttons for old courses */}
                                {!hasModules && (
                                    <>
                                        <p className="progress-label">
                                            Update Progress:
                                        </p>
                                        <div className="progress-buttons">
                                            {[25, 50, 75, 100].map(p => (
                                                <button
                                                    key={p}
                                                    className={`progress-btn ${enrollment.progressPercentage >= p ? 'progress-btn-done' : ''}`}
                                                    onClick={() =>
                                                        handleProgress(p)
                                                    }
                                                    disabled={
                                                        enrollment.progressPercentage
                                                        >= p
                                                    }
                                                >
                                                    {p}%
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {message && (
                                    <div className="progress-message">
                                        {message}
                                    </div>
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