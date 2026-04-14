import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCourse } from "../services/api.js";
import './AddCourse.css';

function AddCourse() {

    const navigate = useNavigate();   // Hook for navigation
    const [loading, setLoading] = useState(false);  // shows loading... when submitting
    const [error, setError] = useState('');  // shows error message
    const [success, setSuccess] = useState('');   // shows success message

    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        tags: '',
        imageLink: '',
        duration: '',
        instructorName: '',
        modules: []  // list of modules added to the course
    });

    // temp state for adding a single module
    const [newModule, setNewModule] = useState({
        moduleId: '',
        title: '',
        type: 'video',
        videoLink: '',
        textContent: '',
        duration: '',
        order: 1
    });

    // handles changes in course-level input fields
    const handleCourseChange = (e) => {
        // updates only the changed field
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    }

    // handles changes in module input fields
    const handleModuleChange = (e) => {
        setNewModule({ ...newModule, [e.target.name]: e.target.value });
    };

    // add a module to the course
    const addModule = () => {
        if (!newModule.title) {
            setError('Module title is required');
            return;
        }

        // new module object
        const module = {
            ...newModule,
            moduleId: `m${courseData.modules.length + 1}`, // unique ID
            order: courseData.modules.length + 1  // maintain order
        }

        // add module to the courseData.modules array
        setCourseData({
            ...courseData,
            modules: [...courseData.modules, module]
        });

        // reset module form
        setNewModule({
            moduleId: '',
            title: '',
            type: 'video',
            videoLink: '',
            textContent: '',
            duration: '',
            order: courseData.modules.length + 2
        });
        setError('');
    }

    // remove module by index
    const removeModule = (index) => {
        // _ refers keeping keeping the existing module and remove the module based on index
        const updated = courseData.modules.filter((_, i) => i !== index);
        setCourseData({ ...courseData, modules: updated });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // At least one module is required
        if (courseData.modules.length === 0) {
            setError('Please add at least one module');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...courseData,
                // converts comma-separated tags strings into array
                tags: courseData.tags.split(',').map(t => t.trim())
            };

            const data = await addCourse(payload);
            
            if (data.id) {
                setSuccess('Course created successfully!');
                setTimeout(() => navigate('/instructor'), 2000);
            } else {
                setError(data.message || 'Failed to create course');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-course-main">
            <button className='back-btn' onClick={() => navigate('/instructor')}>
                Back to Courses
            </button>

            <h1>Create New Course</h1>
            <p className='page-subtitle'>
                Fill the details and modules to your course
            </p>

            <form onSubmit={handleSubmit} className='add-course-form'>
                <div className='form-section'>
                    <h2>Course Details</h2>

                    <div className='form-row'>
                        {/* course title */}
                        <div className='form-group'>
                            <label>Course Title <span style={{ color: "red" }}>*</span></label>
                            <input
                                name="title"
                                value={courseData.title}
                                onChange={handleCourseChange}
                                placeholder="e.g. React Mastery"
                                required
                            />
                        </div>
                        {/* course category */}
                        <div className='form-group'>
                            <label>Category <span style={{ color: "red" }}>*</span></label>
                            <select name='category' value={courseData.category} onChange={handleCourseChange} required>
                                <option value="">Select category</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Database">Database</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Cloud">Cloud</option>
                                <option value="FullStack">Full Stack</option>
                                <option value="DataAnalyst">Data Analyst</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description <span style={{ color: "red" }}>*</span></label>
                        <textarea
                            name="description"
                            value={courseData.description}
                            onChange={handleCourseChange}
                            placeholder="Describe what students will learn..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Level</label>
                            <select name="level" value={courseData.level} onChange={handleCourseChange}>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Duration</label>
                            <input
                                name="duration"
                                value={courseData.duration}
                                onChange={handleCourseChange}
                                placeholder="e.g. 5h 30m"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tags (comma separated)</label>
                            <input
                                name="tags"
                                value={courseData.tags}
                                onChange={handleCourseChange}
                                placeholder="React, JavaScript, Hooks"
                            />
                        </div>
                        <div className="form-group">
                            <label>Instructor Name <span style={{ color: "red" }}>*</span></label>
                            <input
                                name="instructorName"
                                value={courseData.instructorName}
                                onChange={handleCourseChange}
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Course Image URL</label>
                            <input
                                name="imageLink"
                                value={courseData.imageLink}
                                onChange={handleCourseChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                {/* Module */}
                <div className="form-section">
                    <h2>Course Modules</h2>
                    <p className="section-subtitle">
                        Add modules in order. Each module can have video,
                        text, or both.
                    </p>

                    {/* Added modules list */}
                    {courseData.modules.length > 0 && (
                        <div className="modules-list">
                            {courseData.modules.map((mod, index) => (
                                <div key={index} className="module-item">
                                    <div className="module-order">
                                        {index + 1}
                                    </div>
                                    <div className="module-info">
                                        <div className="module-title">
                                            {mod.title}
                                        </div>
                                        <div className="module-meta">
                                            <span className={`type-badge type-${mod.type}`}>
                                                {mod.type === 'video' ? '🎥 Video' :
                                                    mod.type === 'text' ? '📝 Text' :
                                                        '🎥📝 Both'}
                                            </span>
                                            {mod.duration && (
                                                <span>⏱ {mod.duration}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeModule(index)}
                                        className="btn-remove-module"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add new module form */}
                    <div className="add-module-form">
                        <h3>Add Module</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Module Title <span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="title"
                                    value={newModule.title}
                                    onChange={handleModuleChange}
                                    placeholder="e.g. Introduction to React"
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    name="type"
                                    value={newModule.type}
                                    onChange={handleModuleChange}
                                >
                                    <option value="video">🎥 Video only</option>
                                    <option value="text">📝 Text only</option>
                                    <option value="both">🎥📝 Video + Text</option>
                                </select>
                            </div>
                        </div>

                        {/* Video link — show for video and both */}
                        {(newModule.type === 'video' ||
                            newModule.type === 'both') && (
                                <div className="form-group">
                                    <label>YouTube Video Link</label>
                                    <input
                                        name="videoLink"
                                        value={newModule.videoLink}
                                        onChange={handleModuleChange}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                            )}

                        {/* Text content — show for text and both */}
                        {(newModule.type === 'text' ||
                            newModule.type === 'both') && (
                                <div className="form-group">
                                    <label>Text Content</label>
                                    <textarea
                                        name="textContent"
                                        value={newModule.textContent}
                                        onChange={handleModuleChange}
                                        placeholder="Write your module content here..."
                                        rows={4}
                                    />
                                </div>
                            )}

                        <div className="form-group">
                            <label>Duration</label>
                            <input
                                name="duration"
                                value={newModule.duration}
                                onChange={handleModuleChange}
                                placeholder="e.g. 15 mins"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={addModule}
                            className="btn-add-module"
                        >
                            + Add Module
                        </button>
                    </div>
                </div>

                {error && <div className="error-msg">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <button
                    type="submit"
                    className="btn-submit-course"
                    disabled={loading}
                >
                    {loading ? 'Creating Course...' : 'Publish Course'}
                </button>
            </form>
        </div>
    );
}

export default AddCourse;