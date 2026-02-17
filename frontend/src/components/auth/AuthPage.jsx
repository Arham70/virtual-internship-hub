import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDomains } from '../../hooks/useDomains';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { buildSignupPayload, validateSignup } from '../../services/authPage.service';
import { VIEW, FORGOT_STEP, ROLE } from '../../utilities/constants';
import { getAuthVariantFromRole, authTheme } from '../../utilities/authThemes';
import { redirectByRole, getErrorMessage } from '../../utilities/authUtils';
import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

/** Parse pathname to get role and initial view: /student/login, /mentor/signup, /admin/login */
function parseAuthRoute(pathname) {
  const match = pathname.match(/^\/(student|mentor|admin)\/(login|signup)$/);
  if (!match) return null;
  const [, roleSlug, viewSlug] = match;
  const roleMap = { student: ROLE.STUDENT, mentor: ROLE.MENTOR, admin: ROLE.ADMINISTRATOR };
  const viewMap = { login: VIEW.LOGIN, signup: VIEW.SIGNUP };
  const role = roleMap[roleSlug];
  const initialView = viewMap[viewSlug];
  if (role === ROLE.ADMINISTRATOR && initialView === VIEW.SIGNUP) return { role, initialView: VIEW.LOGIN };
  return { role, initialView };
}

function getLeftPanelContent(role, view) {
  if (role === ROLE.ADMINISTRATOR) {
    if (view === VIEW.FORGOT) return { title: 'Reset Admin Password', subtitle: 'Secure your administrative account with a new password.' };
    return { title: 'Secure Administrative Access', subtitle: 'Manage the platform, monitor activities, and ensure smooth operations.' };
  }
  if (view === VIEW.FORGOT) return { title: 'Reset Your Password', subtitle: "Don't worry, we'll help you get back to your learning journey." };
  if (view === VIEW.LOGIN && role === ROLE.MENTOR) return { title: 'Welcome Back, Mentor', subtitle: 'Continue making an impact by guiding the next generation of professionals.' };
  if (view === VIEW.LOGIN && role === ROLE.STUDENT) return { title: 'Welcome Back, Future Professional', subtitle: 'Continue building your skills with real-world projects and expert mentors.' };
  if (role === ROLE.MENTOR) return { title: 'Share Your Expertise', subtitle: 'Join our community of industry experts shaping future careers.' };
  return { title: 'Start Your Learning Journey', subtitle: 'Join thousands of students learning from industry professionals.' };
}

function getCardTitleAndSubtitle(role, view) {
  if (role === ROLE.ADMINISTRATOR && view === VIEW.LOGIN) return { title: 'Administrator Login', subtitle: 'Authorized personnel only' };
  if (view === VIEW.LOGIN) return { title: 'Welcome Back', subtitle: 'Enter your credentials to continue' };
  if (view === VIEW.SIGNUP) return { title: role === ROLE.MENTOR ? 'Create Mentor Account' : 'Create Student Account', subtitle: role === ROLE.MENTOR ? 'Start mentoring the next generation' : 'Start your journey to professional success' };
  return { title: 'Reset Password', subtitle: 'Secure your account with a new password' };
}

export default function AuthPage(props) {
  const { role: propRole, initialView: propInitialView } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const routeAuth = useMemo(() => parseAuthRoute(pathname), [pathname]);
  const initialRole = propRole ?? routeAuth?.role ?? location.state?.role ?? ROLE.STUDENT;
  const isRegisterPage = pathname === '/register' || propInitialView === VIEW.SIGNUP || (routeAuth && routeAuth.initialView === VIEW.SIGNUP);
  const isAdmin = initialRole === ROLE.ADMINISTRATOR;
  const effectiveInitialView = isAdmin ? VIEW.LOGIN : (propInitialView ?? (routeAuth?.initialView) ?? (isRegisterPage ? VIEW.SIGNUP : VIEW.LOGIN));

  const { login, register } = useAuth();
  const [view, setView] = useState(effectiveInitialView);
  const { domains, loading: domainsLoading, error: domainsError } = useDomains(view === VIEW.SIGNUP && !isAdmin);
  const { sendOtp, verifyOtp, resetPassword, resendOtp, loading: forgotLoading } = useForgotPassword();
  const [role, setRole] = useState(initialRole);
  const [forgotStep, setForgotStep] = useState(FORGOT_STEP.EMAIL);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const roleLocked = propRole != null || (routeAuth != null);
  const variant = getAuthVariantFromRole(role);
  const theme = authTheme[variant] || authTheme.student;

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentConfirmPassword, setStudentConfirmPassword] = useState('');
  const [targetDomainIds, setTargetDomainIds] = useState([]);
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorUsername, setMentorUsername] = useState('');
  const [mentorPassword, setMentorPassword] = useState('');
  const [mentorConfirmPassword, setMentorConfirmPassword] = useState('');
  const [professionalBio, setProfessionalBio] = useState('');
  const [expertiseDomainId, setExpertiseDomainId] = useState('');

  useEffect(() => {
    setRole(initialRole);
    setView(
      initialRole === ROLE.ADMINISTRATOR
        ? VIEW.LOGIN
        : (propInitialView ?? routeAuth?.initialView ?? (pathname === '/register' ? VIEW.SIGNUP : VIEW.LOGIN))
    );
    setError('');
  }, [pathname, initialRole, propInitialView, routeAuth?.initialView]);

  const leftContent = useMemo(() => getLeftPanelContent(role, view), [role, view]);
  const cardContent = useMemo(() => getCardTitleAndSubtitle(role, view), [role, view]);

  const clearError = () => setError('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login({ email: loginEmail, password: loginPassword });
    setLoading(false);
    if (result.success) redirectByRole(navigate, result.user.role);
    else setError(getErrorMessage(result.error));
  }

  async function handleForgotSendOtp(e) {
    e.preventDefault();
    setError('');
    const result = await sendOtp(forgotEmail);
    if (result.success) setForgotStep(FORGOT_STEP.OTP);
    else setError(result.error);
  }
  async function handleForgotVerifyOtp(e) {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    const result = await verifyOtp(forgotEmail, otp);
    if (result.success) setForgotStep(FORGOT_STEP.NEW_PASSWORD);
    else setError(result.error);
  }
  async function handleForgotResetPassword(e) {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const result = await resetPassword(forgotEmail, otp, newPassword, confirmPassword);
    if (result.success) {
      setForgotStep(FORGOT_STEP.EMAIL);
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setView(VIEW.LOGIN);
    } else setError(result.error);
  }
  async function handleResendOtp() {
    setError('');
    const result = await resendOtp(forgotEmail);
    if (result.success) setOtp('');
    else setError(result.error);
  }

  const signupFields = {
    role,
    firstName,
    lastName,
    studentEmail,
    studentUsername,
    studentPassword,
    studentConfirmPassword,
    targetDomainIds,
    mentorEmail,
    mentorUsername,
    mentorPassword,
    mentorConfirmPassword,
    professionalBio,
    expertiseDomainId,
  };

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    if (!validateSignup(signupFields, setError)) return;
    setLoading(true);
    const result = await register(buildSignupPayload(signupFields));
    setLoading(false);
    if (result.success) {
      const loginPath = role === ROLE.MENTOR ? '/mentor/login' : '/student/login';
      navigate(loginPath, { state: { fromSignup: true } });
    } else setError(getErrorMessage(result.error));
  }

  const loadingAny = loading || forgotLoading;

  const fromSignup = location.state?.fromSignup === true;

  return (
    <AuthLayout
      variant={variant}
      leftTitle={leftContent.title}
      leftSubtitle={leftContent.subtitle}
      cardTitle={cardContent.title}
      cardSubtitle={cardContent.subtitle}
      errorMessage={error}
      successMessage={view === VIEW.LOGIN && fromSignup ? 'Account created. Please log in.' : undefined}
      showBackToHome
    >
      {view === VIEW.LOGIN && (
        <LoginForm
          email={loginEmail}
          password={loginPassword}
          loading={loading}
          onEmailChange={setLoginEmail}
          onPasswordChange={setLoginPassword}
          onSubmit={handleLogin}
          onForgotPassword={() => { setView(VIEW.FORGOT); clearError(); }}
          onSwitchToSignup={isAdmin ? undefined : () => { setView(VIEW.SIGNUP); clearError(); }}
          hideSignupLink={isAdmin}
          hideAdminLink={variant !== 'student'}
          accentClass={theme.accentClass}
          buttonClass={theme.buttonClass}
        />
      )}
      {view === VIEW.FORGOT && (
        <ForgotPasswordForm
          step={forgotStep}
          email={forgotEmail}
          otp={otp}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          loading={loadingAny}
          onEmailChange={setForgotEmail}
          onOtpChange={setOtp}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSendOtp={handleForgotSendOtp}
          onVerifyOtp={handleForgotVerifyOtp}
          onResetPassword={handleForgotResetPassword}
          onResendOtp={handleResendOtp}
          onBackToEmail={() => { setForgotStep(FORGOT_STEP.EMAIL); setOtp(''); }}
          onBackToOtp={() => setForgotStep(FORGOT_STEP.OTP)}
          onBackToLogin={() => { setView(VIEW.LOGIN); clearError(); }}
        />
      )}
      {view === VIEW.SIGNUP && (
        <SignupForm
          role={role}
          onRoleChange={(r) => { setRole(r); clearError(); }}
          roleLocked={roleLocked}
          accentClass={theme.accentClass}
          buttonClass={theme.buttonClass}
          firstName={firstName}
          lastName={lastName}
          studentEmail={studentEmail}
          studentUsername={studentUsername}
          studentPassword={studentPassword}
          studentConfirmPassword={studentConfirmPassword}
          targetDomainIds={targetDomainIds}
          domains={domains}
          domainsLoading={domainsLoading}
          domainsError={domainsError}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onStudentEmailChange={setStudentEmail}
          onStudentUsernameChange={setStudentUsername}
          onStudentPasswordChange={setStudentPassword}
          onStudentConfirmPasswordChange={setStudentConfirmPassword}
          onTargetDomainIdsChange={setTargetDomainIds}
          mentorEmail={mentorEmail}
          mentorUsername={mentorUsername}
          mentorPassword={mentorPassword}
          mentorConfirmPassword={mentorConfirmPassword}
          professionalBio={professionalBio}
          expertiseDomainId={expertiseDomainId}
          onMentorEmailChange={setMentorEmail}
          onMentorUsernameChange={setMentorUsername}
          onMentorPasswordChange={setMentorPassword}
          onMentorConfirmPasswordChange={setMentorConfirmPassword}
          onProfessionalBioChange={setProfessionalBio}
          onExpertiseDomainIdChange={setExpertiseDomainId}
          loading={loading}
          onSubmit={handleSignup}
          onSwitchToLogin={() => { setView(VIEW.LOGIN); clearError(); }}
        />
      )}
    </AuthLayout>
  );
}
