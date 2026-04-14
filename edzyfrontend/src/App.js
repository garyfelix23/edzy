import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar.js';
import Footer from '../src/components/Footer.js';
import Home from '../src/pages/Home.js';
import Courses from '../src/pages/Courses.js';
import CourseDetail from '../src/pages/CourseDetail.js';
import Login from '../src/pages/Login.js';
import Register from '../src/pages/Register.js';
import Dashboard from '../src/pages/Dashboard.js';
import './App.css';
import InstructorDashboard from './pages/InstructorDashboard.js';
import AddCourse from './pages/AddCourse.js';
import EditCourse from './pages/EditCourse.js';

function App() {
    return (
        <Router>
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/instructor" element={<InstructorDashboard />} />
                    <Route path="/instructor/add-course" element={<AddCourse />} />
                    <Route path="/instructor/edit-course/:id" element={<EditCourse />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;