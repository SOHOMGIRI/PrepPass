import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MouseProvider } from "./context/MouseContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import LiquidCursor from "./components/LiquidCursor.jsx";
import PageTransition from "./components/PageTransition.jsx";
import { initLenis, destroyLenis } from "./lib/lenis.js";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Interview from "./pages/Interview.jsx";
import InterviewSessionDetail from "./pages/InterviewSessionDetail.jsx";
import ResumeMatcher from "./pages/ResumeMatcher.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import ResumeAnalysis from "./pages/ResumeAnalysis.jsx";
import GDPractice from "./pages/GDPractice.jsx";
import CompanyPrep from "./pages/CompanyPrep.jsx";
import TestMode from "./pages/TestMode.jsx";
import AptitudePractice from "./pages/AptitudePractice.jsx";
import RevisionDeck from "./pages/RevisionDeck.jsx";
import History from "./pages/History.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import About from "./pages/About.jsx";
import Careers from "./pages/Careers.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Contact from "./pages/Contact.jsx";

/** Wraps element in PageTransition unless on /test-mode. */
function PT({ children }) {
  const { pathname } = useLocation();
  if (pathname === "/test-mode") return children;
  return <PageTransition>{children}</PageTransition>;
}

/** Manages Lenis lifecycle — disabled on /test-mode. */
function LenisManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/test-mode") {
      destroyLenis();
      return;
    }
    initLenis();
    return () => destroyLenis();
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PT><Landing /></PT>} />
        <Route path="/login" element={<PT><Login /></PT>} />
        <Route path="/register" element={<PT><Register /></PT>} />
        <Route path="/verify-otp" element={<PT><VerifyOtp /></PT>} />
        <Route path="/how-it-works" element={<PT><HowItWorks /></PT>} />
        <Route path="/about" element={<PT><About /></PT>} />
        <Route path="/careers" element={<PT><Careers /></PT>} />
        <Route path="/privacy" element={<PT><Privacy /></PT>} />
        <Route path="/terms" element={<PT><Terms /></PT>} />
        <Route path="/contact" element={<PT><Contact /></PT>} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><PT><Dashboard /></PT></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><PT><Interview /></PT></ProtectedRoute>} />
        <Route path="/interview/session/:id" element={<ProtectedRoute><PT><InterviewSessionDetail /></PT></ProtectedRoute>} />
        <Route path="/resume-matcher" element={<ProtectedRoute><PT><ResumeMatcher /></PT></ProtectedRoute>} />
        <Route path="/resume-analysis" element={<ProtectedRoute><PT><ResumeAnalysis /></PT></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute><PT><ResumeBuilder /></PT></ProtectedRoute>} />
        <Route path="/gd-practice" element={<ProtectedRoute><PT><GDPractice /></PT></ProtectedRoute>} />
        <Route path="/company-prep" element={<ProtectedRoute><PT><CompanyPrep /></PT></ProtectedRoute>} />

        {/* Test Mode — NO PageTransition wrapper (fullscreen needs sync gesture) */}
        <Route path="/test-mode" element={<ProtectedRoute><TestMode /></ProtectedRoute>} />

        <Route path="/aptitude" element={<ProtectedRoute><PT><AptitudePractice /></PT></ProtectedRoute>} />
        <Route path="/revision-deck" element={<ProtectedRoute><PT><RevisionDeck /></PT></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><PT><History /></PT></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MouseProvider>
          <LenisManager />
          <LiquidCursor />
          <AnimatedRoutes />
        </MouseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
