import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { VIEW, FORGOT_STEP, ROLE } from './constants';
import { redirectByRole, getErrorMessage } from './authUtils';
import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

/**
 * Auth page: shows Login, Signup, or Forgot Password.
 * URL /login = login form, /register = signup form.
 * State stays in this file so it's easy to see what data we have.
 */
export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Which form to show (login / signup / forgot password)
  const isRegisterPage = location.pathname === '/register';
  const [view, setView] = useState(isRegisterPage ? VIEW.SIGNUP : VIEW.LOGIN);
  const [role, setRole] = useState(ROLE.STUDENT);
  const [forgotStep, setForgotStep] = useState(FORGOT_STEP.EMAIL);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const [domainsLoading, setDomainsLoading] = useState(false);

  // When user goes to /register, show signup form
  useEffect(() => {
    setView(isRegisterPage ? VIEW.SIGNUP : VIEW.LOGIN);
    setError('');
  }, [isRegisterPage]);

  // Load domains when signup form is shown (for dropdowns)
  useEffect(() => {
    if (view !== VIEW.SIGNUP) return;
    setDomainsLoading(true);
    authAPI
      .getDomains()
      .then((res) => setDomains(res.data || []))
      .catch(() => setDomains([]))
      .finally(() => setDomainsLoading(false));
  }, [view]);

  // --- Form state ---
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
  const [skillLevel, setSkillLevel] = useState('');

  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorUsername, setMentorUsername] = useState('');
  const [mentorPassword, setMentorPassword] = useState('');
  const [mentorConfirmPassword, setMentorConfirmPassword] = useState('');
  const [professionalBio, setProfessionalBio] = useState('');
  const [expertiseDomainId, setExpertiseDomainId] = useState('');

  const clearError = () => setError('');

  // --- Headlines for left panel (change by view) ---
  function getLeftPanelContent() {
    if (view === VIEW.FORGOT) {
      return {
        title: 'Reset Your Password',
        subtitle: "Don't worry, we'll help you get back to your learning journey.",
      };
    }
    if (view === VIEW.LOGIN) {
      return {
        title: 'Welcome Back to Your Future',
        subtitle: 'Continue building your skills with real-world projects and industry mentors.',
      };
    }
    if (role === ROLE.MENTOR) {
      return {
        title: 'Share Your Expertise, Shape Careers',
        subtitle: 'Join our community of industry professionals mentoring the next generation.',
      };
    }
    return {
      title: 'Start Your Professional Journey Today',
      subtitle: 'Connect with mentors, work on real projects, and launch your career.',
    };
  }

  function getCardTitleAndSubtitle() {
    if (view === VIEW.LOGIN) return { title: 'Welcome Back', subtitle: 'Enter your credentials to continue' };
    if (view === VIEW.SIGNUP) return { title: 'Create Account', subtitle: 'Join our community of learners and mentors' };
    return { title: 'Reset Password', subtitle: 'Secure your account with a new password' };
  }

  const leftContent = getLeftPanelContent();
  const cardContent = getCardTitleAndSubtitle();

  // --- Login submit ---
  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login({ email: loginEmail, password: loginPassword });
    setLoading(false);
    if (result.success) {
      redirectByRole(navigate, result.user.role);
    } else {
      setError(getErrorMessage(result.error));
    }
  }

  // --- Forgot password (calls backend API) ---
  async function handleForgotSendOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.sendPasswordResetOTP(forgotEmail);
      setForgotStep(FORGOT_STEP.OTP);
    } catch (err) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.detail || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotVerifyOtp(e) {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.verifyPasswordResetOTP(forgotEmail, otp);
      setForgotStep(FORGOT_STEP.NEW_PASSWORD);
    } catch (err) {
      setError(err.response?.data?.otp?.[0] || err.response?.data?.detail || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    try {
      await authAPI.resetPassword(forgotEmail, otp, newPassword, confirmPassword);
      setForgotStep(FORGOT_STEP.EMAIL);
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setView(VIEW.LOGIN);
    } catch (err) {
      const msg = err.response?.data?.new_password?.[0] ?? err.response?.data?.otp?.[0] ?? err.response?.data?.detail ?? 'Failed to reset password.';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError('');
    setLoading(true);
    try {
      await authAPI.resendPasswordResetOTP(forgotEmail);
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.detail || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  }

  // --- Signup submit ---
  function buildSignupPayload() {
    const payload = {
      email: role === ROLE.STUDENT ? studentEmail : mentorEmail,
      username: role === ROLE.STUDENT ? studentUsername : mentorUsername,
      password: role === ROLE.STUDENT ? studentPassword : mentorPassword,
      password_confirm: role === ROLE.STUDENT ? studentConfirmPassword : mentorConfirmPassword,
      role,
    };
    if (role === ROLE.STUDENT) {
      payload.first_name = firstName;
      payload.last_name = lastName;
      payload.target_domain_ids = targetDomainIds;
      if (skillLevel) payload.current_skill_level = skillLevel;
    } else {
      payload.professional_bio = professionalBio;
      payload.expertise_domain_id = expertiseDomainId ? parseInt(expertiseDomainId, 10) : null;
    }
    return payload;
  }

  function validateSignup() {
    if (role === ROLE.STUDENT) {
      if (!firstName || !lastName || !studentEmail || !studentUsername || !studentPassword || !studentConfirmPassword) {
        setError('Please fill in all required fields.');
        return false;
      }
      if (studentPassword !== studentConfirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      if (targetDomainIds.length === 0) {
        setError('Please select at least one target domain.');
        return false;
      }
    } else {
      if (!mentorEmail || !mentorUsername || !mentorPassword || !mentorConfirmPassword || !professionalBio || !expertiseDomainId) {
        setError('Please fill in all required fields.');
        return false;
      }
      if (mentorPassword !== mentorConfirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    }
    return true;
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    if (!validateSignup()) return;

    setLoading(true);
    const result = await register(buildSignupPayload());
    setLoading(false);

    if (result.success) {
      redirectByRole(navigate, result.user.role);
    } else {
      setError(getErrorMessage(result.error));
    }
  }

  // --- Render ---
  return (
    <AuthLayout
      leftTitle={leftContent.title}
      leftSubtitle={leftContent.subtitle}
      cardTitle={cardContent.title}
      cardSubtitle={cardContent.subtitle}
      errorMessage={error}
    >
      {view === VIEW.LOGIN && (
        <LoginForm
          email={loginEmail}
          password={loginPassword}
          loading={loading}
          onEmailChange={setLoginEmail}
          onPasswordChange={setLoginPassword}
          onSubmit={handleLogin}
          onForgotPassword={() => {
            setView(VIEW.FORGOT);
            clearError();
          }}
          onSwitchToSignup={() => {
            setView(VIEW.SIGNUP);
            clearError();
          }}
        />
      )}

      {view === VIEW.FORGOT && (
        <ForgotPasswordForm
          step={forgotStep}
          email={forgotEmail}
          otp={otp}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          loading={loading}
          onEmailChange={setForgotEmail}
          onOtpChange={setOtp}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSendOtp={handleForgotSendOtp}
          onVerifyOtp={handleForgotVerifyOtp}
          onResetPassword={handleForgotResetPassword}
          onResendOtp={handleResendOtp}
          onBackToEmail={() => {
            setForgotStep(FORGOT_STEP.EMAIL);
            setOtp('');
          }}
          onBackToOtp={() => setForgotStep(FORGOT_STEP.OTP)}
          onBackToLogin={() => {
            setView(VIEW.LOGIN);
            clearError();
          }}
        />
      )}

      {view === VIEW.SIGNUP && (
        <SignupForm
          role={role}
          onRoleChange={(newRole) => {
            setRole(newRole);
            clearError();
          }}
          firstName={firstName}
          lastName={lastName}
          studentEmail={studentEmail}
          studentUsername={studentUsername}
          studentPassword={studentPassword}
          studentConfirmPassword={studentConfirmPassword}
          targetDomainIds={targetDomainIds}
          skillLevel={skillLevel}
          domains={domains}
          domainsLoading={domainsLoading}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onStudentEmailChange={setStudentEmail}
          onStudentUsernameChange={setStudentUsername}
          onStudentPasswordChange={setStudentPassword}
          onStudentConfirmPasswordChange={setStudentConfirmPassword}
          onTargetDomainIdsChange={setTargetDomainIds}
          onSkillLevelChange={setSkillLevel}
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
          onSwitchToLogin={() => {
            setView(VIEW.LOGIN);
            clearError();
          }}
        />
      )}
    </AuthLayout>
  );
}
