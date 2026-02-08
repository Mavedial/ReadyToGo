import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import SubmitAvailability from './pages/SubmitAvailability';

import './style.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Private routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/events"
                        element={
                            <PrivateRoute>
                                <Events />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/events/create"
                        element={
                            <PrivateRoute>
                                <CreateEvent />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/events/:id"
                        element={
                            <PrivateRoute>
                                <EventDetails />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/events/:id/availability"
                        element={
                            <PrivateRoute>
                                <SubmitAvailability />
                            </PrivateRoute>
                        }
                    />

                    {/* Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;