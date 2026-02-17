/**
 * Admin Dashboard – FR8 (user/project/report management), FR10 (project templates & evaluation criteria).
 * Sections: Dashboard overview, Users (students/mentors only), Skill Assessments, Project Templates, Reports.
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../api/admin.api';
import { useDomains } from '../../hooks/useDomains';
import {
  GraduationCapIcon,
  LayoutDashboardIcon,
  UsersIcon,
  FileTextIcon,
  FolderKanbanIcon,
  BarChartIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  ClockIcon,
} from '../ui/Icons';
import './Dashboard.css';

const BASE_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, superadminOnly: false },
  { id: 'users', label: 'Users', icon: UsersIcon, superadminOnly: false },
  { id: 'assessments', label: 'Skill Assessments', icon: FileTextIcon, superadminOnly: false },
  { id: 'projects', label: 'Project Templates', icon: FolderKanbanIcon, superadminOnly: false },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChartIcon, superadminOnly: false },
];

function AdminDashboard() {
  const { user, logout } = useAuth();
  const isSuperadmin = Boolean(user?.is_superuser ?? user?.is_superadmin);
  const navItems = BASE_NAV_ITEMS.filter((item) => !item.superadminOnly || isSuperadmin);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboardHome />;
      case 'users':
        return <AdminUsersSection />;
      case 'assessments':
        return <AdminAssessmentsSection />;
      case 'projects':
        return <AdminProjectsPlaceholder />;
      case 'reports':
        return <AdminReportsPlaceholder />;
      default:
        return <AdminDashboardHome />;
    }
  };

  return (
    <div className={`dashboard-with-sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Top Navbar */}
      <nav className="dashboard-nav-top">
        <div className="nav-brand">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg hidden lg:block"
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="logo-box">
              <GraduationCapIcon className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-medium text-gray-900">Virtual Internship Hub</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="nav-user">
          <div className="user-box hidden md:block">
            <div className="user-name">{user?.username || 'Admin'}</div>
            <div className="user-role">{isSuperadmin ? 'Superadmin' : 'Admin'} · {user?.email || 'admin@example.com'}</div>
          </div>
          {isSuperadmin && (
            <a href="/admin/" target="_blank" rel="noopener noreferrer" className="btn-django-admin" style={{ marginRight: 8, padding: '0.5rem 0.75rem', background: '#111827', color: 'white', borderRadius: 8, fontSize: '0.875rem', textDecoration: 'none' }}>
              Django Admin
            </a>
          )}
          <button type="button" onClick={handleLogout} className="btn-logout-nav">
            <LogOutIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={isActive ? 'active' : ''}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          style={{ top: 64 }}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      {/* Main content */}
      <main className="dashboard-main">{renderContent()}</main>
    </div>
  );
}

function AdminDashboardHome() {
  const metrics = [
    { label: 'Total Students', value: '—', icon: GraduationCapIcon, iconBg: '#eff6ff', iconColor: '#2563eb' },
    { label: 'Active Mentors', value: '—', icon: UsersIcon, iconBg: '#f5f3ff', iconColor: '#7c3aed' },
    { label: 'Active Assessments', value: '—', icon: FileTextIcon, iconBg: '#ecfdf5', iconColor: '#059669' },
    { label: 'Pending Submissions', value: '—', icon: ClockIcon, iconBg: '#fff7ed', iconColor: '#ea580c' },
  ];

  const recentActivities = [
    { id: 1, text: 'Platform ready. Connect backend to see real data.', time: '—' },
  ];

  return (
    <div className="dashboard-section">
      <h1>Dashboard Overview</h1>
      <p className="section-desc">Welcome back. Here&apos;s a summary of your platform (connect API for live data).</p>

      <div className="metrics-grid">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="metric-card">
              <div className="metric-icon" style={{ backgroundColor: m.iconBg, color: m.iconColor }}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          );
        })}
      </div>

      <div className="activity-list" style={{ marginTop: '1.5rem' }}>
        <div className="p-4 border-b border-gray-200 font-medium text-gray-900">Recent Activity</div>
        {recentActivities.map((a) => (
          <div key={a.id} className="activity-item">
            <div>
              <span className="text-gray-900">{a.text}</span>
              <span className="text-gray-500 text-sm ml-2">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminUsersSection() {
  const [tab, setTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const fetchAll = async () => {
      try {
        const [sRes, mRes] = await Promise.all([
          adminApi.getStudents(),
          adminApi.getMentors(),
        ]);
        if (!cancelled) {
          setStudents(sRes.data || []);
          setMentors(mRes.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.detail || err.message || 'Failed to load users');
          setStudents([]);
          setMentors([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const list = tab === 'students' ? students : mentors;
  const roleLabel = tab === 'students' ? 'Student' : 'Mentor';

  return (
    <div className="dashboard-section">
      <h1>Users</h1>
      <p className="section-desc">Students and mentors only (admin users are not listed).</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setTab('students')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: tab === 'students' ? '#111827' : 'white',
            color: tab === 'students' ? 'white' : '#374151',
            cursor: 'pointer',
          }}
        >
          Students ({students.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('mentors')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: tab === 'mentors' ? '#111827' : 'white',
            color: tab === 'mentors' ? 'white' : '#374151',
            cursor: 'pointer',
          }}
        >
          Mentors ({mentors.length})
        </button>
      </div>
      {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    No {tab} found.
                  </td>
                </tr>
              ) : (
                list.map((row) => {
                  const profile = tab === 'students' ? row.student_profile : row.mentor_profile;
                  const name = profile
                    ? (profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : row.username)
                    : row.username;
                  return (
                    <tr key={row.id}>
                      <td>{name}</td>
                      <td>{row.email}</td>
                      <td>{row.username}</td>
                      <td>{row.is_active ? 'Active' : 'Inactive'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminAssessmentsSection() {
  const { domains, loading: domainsLoading } = useDomains();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [assessmentDetail, setAssessmentDetail] = useState(null);
  const [createForm, setCreateForm] = useState({ title: '', domain: '', max_attempts: 2, is_active: true });
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', order: 0, points: 1,
  });
  const [questionSubmitting, setQuestionSubmitting] = useState(false);

  const loadAssessments = async () => {
    try {
      const res = await adminApi.getAssessments();
      setAssessments(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load assessments');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setAssessmentDetail(null);
      return;
    }
    adminApi.getAssessment(selectedId)
      .then((res) => setAssessmentDetail(res.data))
      .catch(() => setAssessmentDetail(null));
  }, [selectedId]);

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      await adminApi.createAssessment({
        title: createForm.title,
        domain: createForm.domain || null,
        max_attempts: Number(createForm.max_attempts) || 2,
        is_active: Boolean(createForm.is_active),
      });
      setCreateForm({ title: '', domain: '', max_attempts: 2, is_active: true });
      await loadAssessments();
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedId) return;
    setQuestionSubmitting(true);
    try {
      await adminApi.createQuestion(selectedId, {
        text: questionForm.text,
        option_a: questionForm.option_a,
        option_b: questionForm.option_b,
        option_c: questionForm.option_c,
        option_d: questionForm.option_d,
        correct_option: questionForm.correct_option,
        order: Number(questionForm.order) || 0,
        points: Number(questionForm.points) || 1,
      });
      setQuestionForm({ text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', order: assessmentDetail?.questions?.length || 0, points: 1 });
      const res = await adminApi.getAssessment(selectedId);
      setAssessmentDetail(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setQuestionSubmitting(false);
    }
  };

  const selectedAssessment = assessments.find((a) => a.id === selectedId);

  return (
    <div className="dashboard-section">
      <h1>Skill Assessments</h1>
      <p className="section-desc">Create and manage skill tests and MCQs (FR2). Admin users are not listed in Users.</p>
      {error && typeof error === 'object' && (
        <pre style={{ color: '#dc2626', marginBottom: '1rem', fontSize: 12 }}>{JSON.stringify(error, null, 2)}</pre>
      )}
      {error && typeof error === 'string' && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}

      <div className="info-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Create assessment</h3>
        <form onSubmit={handleCreateAssessment} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
          <input
            type="text"
            placeholder="Title"
            value={createForm.title}
            onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
            required
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 200 }}
          />
          <select
            value={createForm.domain}
            onChange={(e) => setCreateForm((f) => ({ ...f, domain: e.target.value }))}
            style={{ padding: '0.5rem 0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, minWidth: 180 }}
          >
            <option value="">No domain</option>
            {(domains || []).map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Max attempts</span>
            <input
              type="number"
              min={1}
              value={createForm.max_attempts}
              onChange={(e) => setCreateForm((f) => ({ ...f, max_attempts: e.target.value }))}
              style={{ width: 70, padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 8 }}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={createForm.is_active}
              onChange={(e) => setCreateForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            Active
          </label>
          <button type="submit" disabled={createSubmitting} style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#111827', color: 'white', border: 'none', cursor: 'pointer' }}>
            {createSubmitting ? 'Creating…' : 'Create'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        <div className="admin-table-wrap">
          <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>Assessments</div>
          {domainsLoading || loading ? (
            <div style={{ padding: '1rem', color: '#6b7280' }}>Loading…</div>
          ) : assessments.length === 0 ? (
            <div style={{ padding: '1rem', color: '#6b7280' }}>No assessments yet.</div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {assessments.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(a.id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      border: 'none',
                      borderBottom: '1px solid #e5e7eb',
                      background: selectedId === a.id ? '#f3f4f6' : 'white',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {a.domain_detail?.name || 'No domain'} · {a.questions?.length ?? 0} questions
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {selectedAssessment && assessmentDetail && (
            <>
              <div className="info-card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{assessmentDetail.title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
                  Domain: {assessmentDetail.domain_detail?.name || '—'} · Max attempts: {assessmentDetail.max_attempts} · {assessmentDetail.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="info-card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>Add question</h3>
                <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <textarea
                    placeholder="Question text"
                    value={questionForm.text}
                    onChange={(e) => setQuestionForm((f) => ({ ...f, text: e.target.value }))}
                    required
                    rows={2}
                    style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 8 }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <input
                        key={opt}
                        type="text"
                        placeholder={`Option ${opt}`}
                        value={questionForm[`option_${opt.toLowerCase()}`]}
                        onChange={(e) => setQuestionForm((f) => ({ ...f, [`option_${opt.toLowerCase()}`]: e.target.value }))}
                        style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: 8 }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label>
                      Correct:{' '}
                      <select
                        value={questionForm.correct_option}
                        onChange={(e) => setQuestionForm((f) => ({ ...f, correct_option: e.target.value }))}
                        style={{ padding: '0.35rem', border: '1px solid #e5e7eb', borderRadius: 6 }}
                      >
                        {['A', 'B', 'C', 'D'].map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </label>
                    <label>Order: <input type="number" min={0} value={questionForm.order} onChange={(e) => setQuestionForm((f) => ({ ...f, order: e.target.value }))} style={{ width: 60, padding: '0.35rem' }} /></label>
                    <label>Points: <input type="number" min={1} value={questionForm.points} onChange={(e) => setQuestionForm((f) => ({ ...f, points: e.target.value }))} style={{ width: 60, padding: '0.35rem' }} /></label>
                    <button type="submit" disabled={questionSubmitting} style={{ padding: '0.5rem 1rem', background: '#059669', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                      {questionSubmitting ? 'Adding…' : 'Add question'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="admin-table-wrap">
                <div style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>Questions ({assessmentDetail.questions?.length ?? 0})</div>
                {(!assessmentDetail.questions || assessmentDetail.questions.length === 0) ? (
                  <div style={{ padding: '1rem', color: '#6b7280' }}>No questions yet. Add one above.</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Correct</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessmentDetail.questions.map((q, idx) => (
                        <tr key={q.id}>
                          <td>{q.order}</td>
                          <td style={{ maxWidth: 300 }}>{(q.text || '').slice(0, 80)}{(q.text || '').length > 80 ? '…' : ''}</td>
                          <td>{q.correct_option}</td>
                          <td>{q.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
          {selectedId && !assessmentDetail && <p style={{ color: '#6b7280' }}>Loading assessment…</p>}
          {!selectedId && <p style={{ color: '#6b7280' }}>Select an assessment to add questions.</p>}
        </div>
      </div>
    </div>
  );
}

function AdminProjectsPlaceholder() {
  return (
    <div className="dashboard-section">
      <h1>Project Templates</h1>
      <p className="section-desc">Define, upload, and update project templates and evaluation criteria (FR10).</p>
      <div className="info-card" style={{ marginTop: '1rem' }}>
        <p>Add project templates with title, domain, complexity, and evaluation criteria. These feed into task allocation (FR3) and student tasks.</p>
        <button type="button" className="btn-primary mt-4" style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#111827', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Template (API required)
        </button>
      </div>
    </div>
  );
}

function AdminReportsPlaceholder() {
  return (
    <div className="dashboard-section">
      <h1>Reports & Analytics</h1>
      <p className="section-desc">Progress tracking and skill improvement insights (FR9).</p>
      <div className="info-card" style={{ marginTop: '1rem' }}>
        <p>Charts and tables for signups, completions, and skill improvement over time. Filter by date range and role.</p>
        <button type="button" className="btn-primary mt-4" style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#111827', color: 'white', border: 'none', cursor: 'pointer' }}>
          Export Report (API required)
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
