import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses } from '../services/api.js';
import './Courses.css';

function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');

    // this useEffect runs only once when components mounts (ComponentDidMount)
    useEffect(() => {
        getAllCourses()  
            .then(data => {
                // this to ensure the response is actually an array
                if (Array.isArray(data)){
                    setCourses(data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));  // after fetching, the loading set to false
    }, []) // <- this [] means dependency array and it is empty, so useEffect runs only once when component mounts

    // Get unique categories from courses
    const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];
    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    // Filter courses using filter which creates new array based on filtered results
    const filtered = courses.filter(c => {
        const q = search.toLowerCase(); 
        // if search is empty, show all courses. If search matches title or instructor or tag based on that, the course is displayed
        const matchSearch = !q ||
            c.title?.toLowerCase().includes(q) ||
            c.instructorName?.toLowerCase().includes(q) ||
            c.tags?.some(t => t.toLowerCase().includes(q));
        // if all is selected, show all courses. Else, the matched category course is displayed
        const matchCategory = selectedCategory === 'All' || c.category === selectedCategory;
        const matchLevel = selectedLevel === 'All' || c.level === selectedLevel;
        // returns courses only if all conditions are true.
        return matchSearch && matchCategory && matchLevel;
    });

    if (loading) return <div className="loading">Loading courses...</div>;

    return (
        <div className="courses-page">
            <div className="courses-header">
                <h1>All Courses</h1>
                <p>{courses.length} courses available — find what you want to learn</p>
            </div>

            {/* Search and Filters */}
            <div className="filters-bar">
                <input
                    type="text"
                    placeholder="Search courses, instructors, tags..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="search-input"
                />

                <div className="filter-group">
                    <label>Category</label>
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="filter-select"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Level</label>
                    <select
                        value={selectedLevel}
                        onChange={e => setSelectedLevel(e.target.value)}
                        className="filter-select"
                    >
                        {levels.map(lv => (
                            <option key={lv} value={lv}>{lv}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results count */}
            <p className="results-count">
                Showing {filtered.length} of {courses.length} courses
            </p>

            {/* Course Grid */}
            {filtered.length === 0 ? (
                <div className="no-results">
                    <span>😕</span>
                    <p>No courses match your search.</p>
                    <button onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedLevel('All'); }}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="courses-grid">
                    {filtered.map(course => (
                        <div
                            key={course.id}
                            className="course-card"
                            onClick={() => navigate(`/courses/${course.id}`)}
                        >
                            <div className="course-img-wrapper">
                                <img
                                    src={course.imageLink || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80'}
                                    alt={course.title}
                                    className="course-img"
                                />
                                <span className={`level-badge level-${course.level?.toLowerCase()}`}>
                                    {course.level}
                                </span>
                            </div>

                            <div className="course-body">
                                <span className="course-category-tag">{course.category}</span>
                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-desc">
                                    {course.description?.slice(0, 100)}...
                                </p>

                                <div className="course-tags">
                                    {course.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>

                                <div className="course-meta">
                                    <span>👤 {course.instructorName}</span>
                                    <span>⏱ {course.duration}</span>
                                </div>

                                {course.rating > 0 && (
                                    <div className="course-rating">
                                        ⭐ {course.rating.toFixed(1)}
                                        <span className="rating-count">
                                            ({course.totalReviews} reviews)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Courses;