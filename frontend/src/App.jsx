import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PublicLayout from './components/PublicLayout'
import ProtectedLayout from './components/ProtectedLayout'
import LoadingScreen from './components/LoadingScreen'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import FeaturesPage from './pages/public/FeaturesPage'
import PricingPage from './pages/public/PricingPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import DocsPage from './pages/public/DocsPage'
import PrivacyPage from './pages/public/PrivacyPage'
import TermsPage from './pages/public/TermsPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import AuthCallback from './pages/auth/AuthCallback'

// App Pages
import DashboardPage from './pages/app/DashboardPage'
import WorkspacePage from './pages/app/WorkspacePage'
import ProfilePage from './pages/app/ProfilePage'
import SettingsPage from './pages/app/SettingsPage'
import NotificationsPage from './pages/app/NotificationsPage'
import BillingPage from './pages/app/BillingPage'
import HelpPage from './pages/app/HelpPage'

// System Pages
import NotFoundPage from './pages/system/NotFoundPage'
import ErrorPage from './pages/system/ErrorPage'
import MaintenancePage from './pages/system/MaintenancePage'
import AccessDeniedPage from './pages/system/AccessDeniedPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="workspace" element={<WorkspacePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>

        {/* System Routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App