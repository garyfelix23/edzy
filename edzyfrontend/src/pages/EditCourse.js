import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseById, updateCourse } from '../services/api.js';
import './styles/AddCourse.css';

function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'Beginner',
        tags: '',
        imageLink: '',
        duration: '',
        instructorName: '',
        modules: []
    });

    const [newModule, setNewModule] = useState({
        moduleId: '',
        title: '',
        type: 'video',
        videoLink: '',
        textContent: '',
        duration: '',
        order: 1
    });

    useEffect(() => {
        getCourseById(id) // fetches course by id
            .then(data => {
                setCourseData({
                    ...data,
                    tags: Array.isArray(data.tags) // check if tags is an array
                        ? data.tags.join(', ')   // if yes, then convert to a comma-separated string
                        : data.tags || ''      // else, if it is already a string, keep it as it is.
                });
                // set next module order based on existing modules
                setNewModule(prev => ({
                    ...prev,
                    order: (data.modules?.length || 0) + 1
                }));
            })
            .catch(err => console.error('Failed to load course:', err))
            .finally(() => setLoading(false));
    }, [id]);  // this useEffect runs based on the id 

    const handleCourseChange = (e) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const handleModuleChange = (e) => {
        setNewModule({ ...newModule, [e.target.name]: e.target.value });
    };

    const addModule = () => {
        if (!newModule.title) {
            setError('Module title is required');
            return;
        }

        // copies all fields from newModule and adds it
        const module = {
            ...newModule,     
            moduleId: `m${Date.now()}`,   // generate unique ID
            order: courseData.modules.length + 1
        };

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
    };

    const removeModule = (index) => {
        // a popup is displayed 
        if (!window.confirm('Remove this module?')) return;
        // filter is used to create a new array
        const updated = courseData.modules.filter((_, i) => i !== index);  // _ means the actual module isn't used, only the index i is used
        // re-number orders after removal
        const reordered = updated.map((mod, i) => ({ ...mod, order: i + 1 }));
        setCourseData({ ...courseData, modules: reordered });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        if (courseData.modules.length === 0) {
            setError('Please add at least one module');
            setSaving(false);
            return;
        }

        try {
            const payload = {
                ...courseData,
                tags: typeof courseData.tags === 'string'
                    ? courseData.tags.split(',').map(t => t.trim())
                    : courseData.tags
            };
            const data = await updateCourse(id, payload);
            if (data.id) {
                setSuccess('Course updated successfully!');
                setTimeout(() => navigate('/instructor'), 2000);
            } else {
                setError('Failed to update course');
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading course...</div>;

    return (
        <div className="add-course-main">
            <button className="back-btn" onClick={() => navigate('/instructor')}>
                ← Back to My Courses
            </button>

            <h1>Edit Course</h1>
            <p className="page-subtitle">Update your course details and modules</p>

            <form onSubmit={handleSubmit} className="add-course-form">

                {/* Course Details */}
                <div className="form-section">
                    <h2>Course Details</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Course Title <span style={{ color: "red" }}>*</span></label>
                            <input
                                name="title"
                                value={courseData.title}
                                onChange={handleCourseChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category <span style={{ color: "red" }}>*</span></label>
                            <select
                                name="category"
                                value={courseData.category}
                                onChange={handleCourseChange}
                                required
                            >
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
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Level</label>
                            <select
                                name="level"
                                value={courseData.level}
                                onChange={handleCourseChange}
                            >
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
                                placeholder="e.g. 10h 30m"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Instructor Name</label>
                            <input
                                name="instructorName"
                                value={courseData.instructorName || ''}
                                onChange={handleCourseChange}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label>Tags (comma separated)</label>
                            <input
                                name="tags"
                                value={courseData.tags}
                                onChange={handleCourseChange}
                                placeholder="React, JavaScript"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Course Image URL</label>
                        <input
                            name="imageLink"
                            value={courseData.imageLink || ''}
                            onChange={handleCourseChange}
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Modules Section */}
                <div className="form-section">
                    <h2>Course Modules</h2>
                    <p className="section-subtitle">
                        Manage existing modules or add new ones.
                    </p>

                    {/* Existing + newly added modules list */}
                    {courseData.modules.length > 0 && (
                        <div className="modules-list">
                            {courseData.modules.map((mod, index) => (
                                <div key={mod.moduleId || index} className="module-item">
                                    <div className="module-order">{index + 1}</div>
                                    <div className="module-info">
                                        <div className="module-title">{mod.title}</div>
                                        <div className="module-meta">
                                            <span className={`type-badge type-${mod.type}`}>
                                                {mod.type === 'video' ? '🎥 Video' :
                                                 mod.type === 'text'  ? '📝 Text'  :
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
                                        title="Remove module"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add new module form */}
                    <div className="add-module-form">
                        <h3>Add New Module</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Module Title <span style={{ color: "red" }}>*</span></label>
                                <input
                                    name="title"
                                    value={newModule.title}
                                    onChange={handleModuleChange}
                                    placeholder="e.g. Advanced Hooks"
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

                        {/* Video link */}
                        {(newModule.type === 'video' || newModule.type === 'both') && (
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

                        {/* Text content */}
                        {(newModule.type === 'text' || newModule.type === 'both') && (
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
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}

export default EditCourse;