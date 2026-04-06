const BASE_URL = 'http://13.50.115.156:8080/api';

// attach token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// AUTH 
export const registerUser = (data) => {
    return fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json());
};

export const loginUser = (data) => {
    return fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json());
};

// COURSES 
export const getAllCourses = () => {
    return fetch(`${BASE_URL}/courses`)
        .then(res => res.json());
};

export const getCourseById = (id) => {
    return fetch(`${BASE_URL}/courses/${id}`)
        .then(res => res.json());
};

// ENROLLMENTS 
export const enrollCourse = (courseId) => {
    return fetch(`${BASE_URL}/enrollments?courseId=${courseId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        }
    }).then(res => res.json());
};

export const getMyEnrollments = () => {
    return fetch(`${BASE_URL}/enrollments/me`, {
        headers: getAuthHeader()
    }).then(res => res.json());
};

export const getDashboard = () => {
    return fetch(`${BASE_URL}/enrollments/dashboard`, {
        headers: getAuthHeader()
    }).then(res => res.json());
};

export const updateProgress = (enrollmentId, percent) => {
    return fetch(`${BASE_URL}/enrollments/${enrollmentId}/progress?percent=${percent}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader() 
        }
    }).then(res => res.json());
};