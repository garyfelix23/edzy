// const BASE_URL = 'http://13.50.115.156:8080/api';
const BASE_URL = 'http://localhost:8081/api';

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

// all courses   
export const getAllCourses = () => {
    return fetch(`${BASE_URL}/courses`)
        .then(res => res.json());
};

// Add Ons: 
// 1. Instructor -> get their courses
export const getAllInstructorCourses = () => {
    return fetch(`${BASE_URL}/courses/my-courses`, {
        headers: getAuthHeader()
    }).then(res => res.json());
}

// 2. Instructor -> add course
export const addCourse = (data) => {
    return fetch(`${BASE_URL}/courses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

// 3. Instructor -> update course
export const updateCourse = (id, data) => {
    return fetch(`${BASE_URL}/courses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

// 4. Instructor -> delete course
export const deleteCourse = (id) => {
    return fetch(`${BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
    }).then(res => res.json());
}

// course by ID
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

// get Student enrollments
export const getMyEnrollments = () => {
    return fetch(`${BASE_URL}/enrollments/me`, {
        headers: getAuthHeader()
    }).then(res => res.json());
};

// student dashboard
export const getDashboard = () => {
    return fetch(`${BASE_URL}/enrollments/dashboard`, {
        headers: getAuthHeader()
    }).then(res => res.json());
};

// Add On: Student -> complete a module
export const completeModule = (enrollmentId, moduleId) => {
    return fetch(`${BASE_URL}/enrollments/${enrollmentId}/complete-module/${moduleId}`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        }
    }).then(res => res.json());
};

// Old approach
export const updateProgress = (enrollmentId, percent) => {
    return fetch(`${BASE_URL}/enrollments/${enrollmentId}/progress?percent=${percent}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader() 
        }
    }).then(res => res.json());
};