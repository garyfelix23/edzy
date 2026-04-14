import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { deleteCourse, getAllInstructorCourses } from '../services/api.js';
import './InstructorDashboard.css';

function InstructorDashboard(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(!token || role !== 'INSTRUCTOR'){
            navigate('/login');
            return;
        }
        getAllInstructorCourses()
        .then(data => {
            if(Array.isArray(data)){
                setCourses(data);
            }
        })
        .catch(err => console.error('Failed to load courses: ', err))
        .finally(() => setLoading(false));
    }, [token, role, navigate]);

    const handleDelete = async (id) => {
        if(!window.confirm('Delete this course?')) return;
        try{
            await deleteCourse(id);
            setCourses(courses.filter(c => c.id !== id));
        }catch (err){
            console.error('Delete failed: ', err);
        }
    };

    if (loading) return <div className='loading'>Loading your courses....</div>


    return (
        <div className="instructor-div">
            <div className="instructor-header">
                <div>
                    <h1>Welcome, {name}!</h1>
                    <p>Manage your courses and track student enrollments.</p>
                </div>
                <Link to="/instructor/add-course" className="btn-add-course">
                    + Add New Course
                </Link>
            </div>

            <div className="instructor-stats">
                <div className="istat-card">
                    <div className="istat-number">{courses.length}</div>
                    <div className="istat-label">Total Courses</div>
                </div>
                <div className="istat-card">
                    <div className="istat-number">
                        {courses.reduce((sum, c) =>
                            sum + (c.modules?.length || 0), 0)}
                    </div>
                    <div className="istat-label">Total Modules</div>
                </div>
            </div>

            <h2 className="section-title">My Courses</h2>
            
            {courses.length === 0 ? (
                <div className="empty-instructor">
                    <p>You haven't created any courses yet.</p>
                    <Link to="/instructor/add-course">
                        Create Your First Course
                    </Link>
                </div>
            ) : (
                <div className="instructor-courses">
                    {courses.map(course => (
                        <div key={course.id} className="instructor-course-card">
                            <img
                                src={course.imageLink ||
                                    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80'}
                                alt={course.title}
                                className="icard-img"
                            />
                            <div className="icard-body">
                                <div className="icard-top">
                                    <span className="icard-category">
                                        {course.category}
                                    </span>
                                    <span className="icard-level">
                                        {course.level}
                                    </span>
                                </div>
                                <h3>{course.title}</h3>
                                <p>{course.description?.slice(0, 100)}...</p>
                                <div className="icard-modules">
                                    {course.modules?.length || 0} modules
                                </div>
                            </div>
                            <div className="icard-actions">
                                <button
                                    onClick={() => navigate(
                                        `/instructor/edit-course/${course.id}`
                                    )}
                                    className="btn-edit"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(course.id)}
                                    className="btn-delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default InstructorDashboard