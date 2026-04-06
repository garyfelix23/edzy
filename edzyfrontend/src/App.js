// import './App.css';

// function App() {
//   return (
//     <div>
//     </div>
//   );
// }

// export default App;

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
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;