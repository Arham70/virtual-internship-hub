/**
 * Student Dashboard – Assessment first (target domain), then tasks (beginner) after pass, career chatbot.
 * FR2: Skill assessment; tasks recommended by skill/performance; FR7: Career guidance chatbot.
 */
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCapIcon,
  LayoutDashboardIcon,
  CheckSquareIcon,
  FolderOpenIcon,
  BellIcon,
  MessageCircleIcon,
  LogOutIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  LockIcon,
  TargetIcon,
  AwardIcon,
  SendIcon,
} from '../ui/Icons';
import './Dashboard.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { id: 'tasks', label: 'My Tasks', icon: CheckSquareIcon },
  { id: 'portfolio', label: 'Portfolio', icon: FolderOpenIcon },
];

// Mock beginner tasks (shown only after assessment passed)
const MOCK_BEGINNER_TASKS = [
  { id: 1, title: 'Build a Personal Portfolio Website', project: 'Portfolio Project', domain: 'Web Development', difficulty: 'Beginner', status: 'not-started', description: 'Create a simple portfolio using HTML, CSS, and basic JavaScript.' },
  { id: 2, title: 'Create a Todo List App', project: 'React Fundamentals', domain: 'Web Development', difficulty: 'Beginner', status: 'not-started', description: 'Build a todo list with add, delete, and mark complete.' },
  { id: 3, title: 'Design a Mobile App Wireframe', project: 'UI/UX Basics', domain: 'UI/UX Design', difficulty: 'Beginner', status: 'not-started', description: 'Create wireframes for a mobile app.' },
];

const CHATBOT_SUGGESTIONS = [
  'How do I start freelancing?',
  'What skills are in demand?',
  'Tips for building a portfolio',
];

function getBotReply(input) {
  const lower = (input || '').toLowerCase();
  if (lower.includes('freelanc') || lower.includes('start')) return 'To start freelancing: 1) Build a strong portfolio. 2) Create profiles on Upwork, Fiverr. 3) Start with smaller projects. 4) Network and ask for referrals.';
  if (lower.includes('skill') || lower.includes('demand')) return 'High-demand skills: Web Dev (React, Next.js), Mobile (React Native, Flutter), UI/UX, Data Science, Cloud (AWS, Azure), Cybersecurity.';
  if (lower.includes('portfolio')) return 'Portfolio tips: Quality over quantity, include case studies, live demos or GitHub links, keep it updated.';
  return 'I can help with freelancing tips, career advice, and skill development. Ask something specific!';
}

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [assessmentPassed, setAssessmentPassed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const studentName = user?.student_profile?.first_name && user?.student_profile?.last_name
    ? `${user.student_profile.first_name} ${user.student_profile.last_name}`
    : user?.username || 'Student';
  const targetDomains = user?.student_profile?.target_domains?.length > 0
    ? user.student_profile.target_domains.map((d) => d.name)
    : ['Your domains'];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <StudentDashboardHome
            studentName={studentName}
            targetDomains={targetDomains}
            assessmentPassed={assessmentPassed}
            onStartAssessment={() => {}}
            onMarkPassed={() => setAssessmentPassed(true)}
          />
        );
      case 'tasks':
        return <StudentTasksPlaceholder assessmentPassed={assessmentPassed} onStartAssessment={() => setActiveView('dashboard')} />;
      case 'portfolio':
        return <StudentPortfolioPlaceholder />;
      default:
        return (
          <StudentDashboardHome
            studentName={studentName}
            targetDomains={targetDomains}
            assessmentPassed={assessmentPassed}
            onStartAssessment={() => {}}
            onMarkPassed={() => setAssessmentPassed(true)}
          />
        );
    }
  };

  return (
    <div className="dashboard-container" style={{ background: '#f9fafb', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <nav className="dashboard-nav" style={{ background: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: 'none' }}>
        <div className="student-dashboard-nav" style={{ width: '100%', maxWidth: 1600, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <GraduationCapIcon className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-medium text-gray-900">Virtual Internship Hub</div>
                <div className="text-xs text-gray-500">Student Portal</div>
              </div>
            </div>
            <div className="nav-links hidden md:flex">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={isActive ? 'active' : ''}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="button" className="p-2 hover:bg-gray-100 rounded-lg relative" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications">
              <BellIcon className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid #e5e7eb' }}>
              <div className="hidden sm:block text-right">
                <div className="text-sm text-gray-900">{studentName}</div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
              <button type="button" onClick={handleLogout} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Logout">
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="dashboard-content" style={{ maxWidth: 1600, margin: '0 auto', padding: '1.5rem 2rem' }}>
        {renderContent()}
      </div>

      {/* Career Chatbot trigger */}
      <button type="button" className="chatbot-trigger" onClick={() => setShowChatbot(true)} title="Career Guidance">
        <MessageCircleIcon className="w-6 h-6" />
      </button>

      {/* Career Chatbot panel */}
      {showChatbot && <CareerChatbotPanel onClose={() => setShowChatbot(false)} />}
    </div>
  );
}

function StudentDashboardHome({ studentName, targetDomains, assessmentPassed, onStartAssessment, onMarkPassed }) {
  return (
    <div className="dashboard-section">
      {/* Welcome card */}
      <div className="welcome-card" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome back, {studentName}!</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>
          {assessmentPassed ? 'Great job on passing your assessment. Check out your recommended tasks below.' : 'Complete your skill assessment to unlock personalized tasks and get started.'}
        </p>
        {targetDomains.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {targetDomains.map((d, i) => (
              <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.2)', borderRadius: 8, fontSize: '0.875rem' }}>
                {d}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Assessment block – primary focus */}
      {!assessmentPassed ? (
        <div className="assessment-cta-block">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: 12, background: '#fed7aa', color: '#c2410c' }}>
              <AlertCircleIcon className="w-8 h-8" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>Complete Your Skill Assessment</h2>
              <p style={{ color: '#374151', marginBottom: '1rem' }}>
                Take the skill assessment for your target domains to unlock tasks and get domain recommendations. Covers: <strong>{targetDomains.join(', ')}</strong>.
              </p>
              <div className="assessment-card-inner">
                <h3 style={{ marginBottom: '0.25rem', color: '#111827' }}>Target Domain Skill Assessment</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>One assessment for your selected domains.</p>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                  <span>~15–20 Questions</span>
                  <span>Pass: 60%</span>
                </div>
                <button type="button" className="btn-start-assessment" onClick={onMarkPassed} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(90deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
                  Start Assessment (demo: mark passed)
                </button>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.75rem' }}>0 of 1 assessment completed</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="assessment-passed-block">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 12, background: '#a7f3d0', color: '#047857' }}>
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '0.25rem', color: '#111827' }}>Assessment Passed!</h3>
              <p style={{ color: '#374151', margin: 0 }}>Based on your performance, we&apos;ve unlocked beginner-level tasks for you.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tasks – only after pass */}
      {assessmentPassed ? (
        <div className="tasks-section-card">
          <div className="tasks-section-header">
            <div>
              <h2 style={{ marginBottom: '0.5rem', color: '#111827' }}>Recommended for You</h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Beginner level tasks based on your assessment and skills.</p>
            </div>
            <span className="task-badge beginner">Beginner</span>
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
            {MOCK_BEGINNER_TASKS.map((task) => (
              <div key={task.id} className="task-item-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <span className="task-badge beginner" style={{ marginRight: '0.5rem' }}>{task.difficulty}</span>
                    <strong style={{ color: '#111827' }}>{task.title}</strong>
                  </div>
                  <button type="button" style={{ padding: '0.35rem 0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.875rem' }}>Start Task</button>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0' }}>{task.project} • {task.domain}</p>
                <p style={{ fontSize: '0.875rem', color: '#374151', margin: 0 }}>{task.description}</p>
                <span className="task-badge not-started" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Not Started</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="tasks-locked-block">
          <div className="lock-icon-wrap">
            <LockIcon className="w-6 h-6" />
          </div>
          <h3 style={{ marginBottom: '0.5rem', color: '#111827' }}>Tasks Locked</h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
            Complete the skill assessment above to unlock personalized tasks based on your domains and performance.
          </p>
          <button type="button" onClick={() => {}} style={{ padding: '0.5rem 1rem', border: '1px solid #2563eb', color: '#2563eb', background: 'transparent', borderRadius: 8, cursor: 'pointer' }}>Take Assessment Now</button>
        </div>
      )}

      {/* Progress summary */}
      <div className="progress-cards-grid">
        <div className="progress-card">
          <div className="progress-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><TargetIcon className="w-6 h-6" /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>0</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tasks Completed</div>
          </div>
        </div>
        <div className="progress-card">
          <div className="progress-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}><AwardIcon className="w-6 h-6" /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>{assessmentPassed ? 'Intermediate' : 'Not assessed'}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Skill Level</div>
          </div>
        </div>
        <div className="progress-card">
          <div className="progress-icon" style={{ background: assessmentPassed ? '#ecfdf5' : '#f3f4f6', color: assessmentPassed ? '#059669' : '#9ca3af' }}><CheckCircleIcon className="w-6 h-6" /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>{assessmentPassed ? '1/1' : '0/1'}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Assessments Passed</div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="info-card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#111827' }}>Quick Links</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', cursor: 'pointer', textAlign: 'left' }} className="hover:bg-gray-50">
            <div style={{ padding: '0.5rem', background: '#eff6ff', borderRadius: 8, color: '#2563eb' }}><FolderOpenIcon className="w-5 h-5" /></div>
            <div>
              <div className="font-medium text-gray-900">View Portfolio</div>
              <div className="text-xs text-gray-600">Showcase your work</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentTasksPlaceholder({ assessmentPassed, onStartAssessment }) {
  if (!assessmentPassed) {
    return (
      <div className="dashboard-section">
        <h1>My Tasks</h1>
        <p className="section-desc">Complete the skill assessment first to see recommended tasks.</p>
        <div className="tasks-locked-block">
          <div className="lock-icon-wrap"><LockIcon className="w-6 h-6" /></div>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Tasks are recommended after you pass the assessment.</p>
          <button type="button" onClick={onStartAssessment} style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Go to Assessment</button>
        </div>
      </div>
    );
  }
  return (
    <div className="dashboard-section">
      <h1>My Tasks</h1>
      <p className="section-desc">Your assigned and recommended tasks (beginner first).</p>
      <div className="info-card">
        <p>Task list will load from API. Beginner tasks shown first based on your assessment score.</p>
      </div>
    </div>
  );
}

function StudentPortfolioPlaceholder() {
  return (
    <div className="dashboard-section">
      <h1>My Portfolio</h1>
      <p className="section-desc">Showcase completed projects (FR6).</p>
      <div className="info-card">
        <p>Portfolio items from completed projects will appear here. Connect API when ready.</p>
      </div>
    </div>
  );
}

function CareerChatbotPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hi! I'm your career guidance assistant. I can help with freelancing tips, career advice, and skill development. What would you like to know?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [inputValue, setInputValue] = useState('');

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: messages.length + 1, type: 'user', text: text.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setTimeout(() => {
      const botText = getBotReply(text);
      setMessages((prev) => [...prev, { id: prev.length + 2, type: 'bot', text: botText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 600);
  };

  return (
    <>
      <div className="chatbot-overlay" onClick={onClose} aria-hidden />
      <div className="chatbot-panel">
        <div className="chatbot-header">
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Career Guidance & Freelancing Tips</h3>
          <button type="button" onClick={onClose} style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }} aria-label="Close"><XIcon className="w-5 h-5" /></button>
        </div>
        <div className="chat-messages">
          {messages.map((m) => (
            <div key={m.id} className={`chat-message ${m.type}`}>
              <div>{m.text}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '0.25rem' }}>{m.time}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
          {CHATBOT_SUGGESTIONS.map((q, i) => (
            <button key={i} type="button" onClick={() => send(q)} style={{ display: 'block', width: '100%', marginBottom: '0.35rem', padding: '0.4rem 0.75rem', background: '#f3f4f6', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', textAlign: 'left' }}>{q}</button>
          ))}
        </div>
        <div className="chat-input-wrap">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(inputValue)} placeholder="Ask about careers or freelancing..." />
          <button type="button" onClick={() => send(inputValue)}><SendIcon className="w-4 h-4" /></button>
        </div>
      </div>
    </>
  );
}

function XIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default StudentDashboard;
