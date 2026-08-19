import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import LiquidCursor from "./components/LiquidCursor.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Interview from "./pages/Interview.jsx";
import InterviewSessionDetail from "./pages/InterviewSessionDetail.jsx";
import ResumeMatcher from "./pages/ResumeMatcher.jsx";
import GDPractice from "./pages/GDPractice.jsx";
import History from "./pages/History.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LiquidCursor />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/session/:id"
            element={
              <ProtectedRoute>
                <InterviewSessionDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-matcher"
            element={
              <ProtectedRoute>
                <ResumeMatcher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gd-practice"
            element={
              <ProtectedRoute>
                <GDPractice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
