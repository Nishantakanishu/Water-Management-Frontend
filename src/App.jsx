import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import WorkingLogin from './components/WorkingLogin';
import CleanLogin from './components/CleanLogin';
import FinalLogin from './components/FinalLogin';
import ConsumerPage from './ConsumerPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('authToken');

  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/portal" /> : <Login />} />
          <Route path="/working-login" element={<WorkingLogin />} />
          <Route path="/clean-login" element={<CleanLogin />} />
          <Route path="/final-login" element={<FinalLogin />} />
          <Route path="/portal" element={<ConsumerPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;