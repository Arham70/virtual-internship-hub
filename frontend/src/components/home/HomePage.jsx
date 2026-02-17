import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCapIcon, BriefcaseIcon } from '../ui';

const iconCl = 'size-6';
function ArrowRightIcon({ className = iconCl }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>);
}
function MenuIcon() {
  return (<svg className={iconCl} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>);
}
function XIcon() {
  return (<svg className={iconCl} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
}
function StarIcon() {
  return (<svg className="size-5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>);
}

export default function HomePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToStudentSignup = () => navigate('/student/signup');
  const goToMentorSignup = () => navigate('/mentor/signup');
  const goToAdminLogin = () => navigate('/admin/login');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <GraduationCapIcon className="size-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl text-gray-900">Virtual Internship Hub</h1>
                <p className="text-xs text-gray-600">Empower Your Career</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Testimonials</a>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300">
                <button type="button" onClick={goToStudentSignup} className="text-gray-700 hover:text-blue-600 transition-colors">Student</button>
                <button type="button" onClick={goToMentorSignup} className="text-gray-700 hover:text-blue-600 transition-colors">Mentor</button>
                <button type="button" onClick={goToAdminLogin} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">Admin</button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-3">
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2">How It Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 py-2">Testimonials</a>
                <div className="h-px bg-gray-200 my-2" />
                <button type="button" onClick={goToStudentSignup} className="text-left px-3 py-2 text-gray-700 hover:text-blue-600">Student</button>
                <button type="button" onClick={goToMentorSignup} className="text-left px-3 py-2 text-gray-700 hover:text-blue-600">Mentor</button>
                <button type="button" onClick={goToAdminLogin} className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">Admin</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>⚡ Trusted by 10,000+ Professionals</span>
              </div>
              <h1 className="text-5xl lg:text-6xl text-gray-900 leading-tight">
                Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Freelance Career</span> with Real Experience
              </h1>
              <p className="text-xl text-gray-600 max-w-xl">
                Connect with industry experts, work on real-world projects, and build your portfolio.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={goToStudentSignup}
                  className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all text-lg inline-flex items-center"
                >
                  Start as Student
                  <ArrowRightIcon className="ml-2 size-5 inline-block" />
                </button>
                <button
                  type="button"
                  onClick={goToMentorSignup}
                  className="px-8 py-6 bg-white text-gray-900 border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all text-lg"
                >
                  Join as Mentor
                </button>
              </div>
              <div className="flex flex-wrap gap-8 pt-4">
                <div><div className="text-3xl text-gray-900">10K+</div><div className="text-sm text-gray-600">Active Students</div></div>
                <div><div className="text-3xl text-gray-900">500+</div><div className="text-sm text-gray-600">Expert Mentors</div></div>
                <div><div className="text-3xl text-gray-900">1000+</div><div className="text-sm text-gray-600">Projects Completed</div></div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl transform rotate-3 opacity-20" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Virtual Internship"
                className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-gray-900 mb-4">Why Choose Virtual Internship Hub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to kickstart your freelance career</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { Icon: BriefcaseIcon, title: 'Real Projects', text: 'Work on actual client projects and build your portfolio.', from: 'from-blue-600', to: 'to-indigo-600', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-100' },
              { title: 'Expert Mentorship', text: 'Learn from industry professionals who know what it takes.', from: 'from-purple-600', to: 'to-pink-600', bg: 'from-purple-50 to-pink-50', border: 'border-purple-100' },
              { title: 'Skill Development', text: 'Choose from 12+ domains and develop in-demand skills.', from: 'from-green-600', to: 'to-teal-600', bg: 'from-green-50 to-teal-50', border: 'border-green-100' },
              { title: 'Flexible Schedule', text: 'Work at your own pace. Perfect for students and career switchers.', from: 'from-orange-600', to: 'to-red-600', bg: 'from-orange-50 to-red-50', border: 'border-orange-100' },
              { title: 'Certifications', text: 'Earn recognized certificates for LinkedIn and your resume.', from: 'from-yellow-600', to: 'to-orange-600', bg: 'from-yellow-50 to-orange-50', border: 'border-yellow-100' },
              { title: 'Global Network', text: 'Connect with professionals and students worldwide.', from: 'from-indigo-600', to: 'to-blue-600', bg: 'from-indigo-50 to-blue-50', border: 'border-indigo-100' },
            ].map(({ Icon = BriefcaseIcon, title, text, from, to, bg, border }) => (
              <div key={title} className={`p-8 bg-gradient-to-br ${bg} rounded-2xl border ${border} hover:shadow-xl transition-all group`}>
                <div className={`size-14 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="size-7 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Sign Up', text: 'Create your account as a student or mentor. Fill in your profile.' },
              { step: 2, title: 'Get Matched', text: 'Our system matches you with the right mentor and projects.' },
              { step: 3, title: 'Start Learning', text: 'Work on real projects, learn from experts, build your portfolio.' },
            ].map(({ step, title, text }) => (
              <div key={step} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all">
                <div className="size-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl mb-6 mx-auto">{step}</div>
                <h3 className="text-2xl text-gray-900 mb-4 text-center">{title}</h3>
                <p className="text-gray-600 text-center">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from our community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: 'This platform transformed my career. I landed my first freelance client in 3 months!', name: 'Sarah Johnson', role: 'Web Developer', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-100', initials: 'SJ' },
              { quote: 'As a mentor, I love giving back. The platform makes it easy to connect with motivated students.', name: 'Michael Chen', role: 'Senior Designer', bg: 'from-purple-50 to-pink-50', border: 'border-purple-100', initials: 'MC' },
              { quote: 'Real-world projects gave me the confidence and portfolio I needed. Highly recommend!', name: 'Aisha Patel', role: 'Data Analyst', bg: 'from-green-50 to-teal-50', border: 'border-green-100', initials: 'AP' },
            ].map(({ quote, name, role, bg, border, initials }) => (
              <div key={initials} className={`bg-gradient-to-br ${bg} rounded-2xl p-8 border ${border}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                </div>
                <p className="text-gray-700 mb-6 italic">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center text-gray-700 font-semibold`}>{initials}</div>
                  <div>
                    <div className="text-gray-900">{name}</div>
                    <div className="text-sm text-gray-600">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl text-white mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of students and mentors building their future today.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button type="button" onClick={goToStudentSignup} className="px-8 py-6 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all text-lg inline-flex items-center">
              Get Started Free
              <ArrowRightIcon className="ml-2 size-5 inline-block" />
            </button>
            <button type="button" onClick={goToMentorSignup} className="px-8 py-6 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 transition-all text-lg">
              Become a Mentor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <GraduationCapIcon className="size-6 text-white" />
            </div>
            <h3 className="text-white">Virtual Internship Hub</h3>
          </div>
          <p className="text-sm text-gray-400 mb-6">Empowering the next generation through mentorship and real-world experience.</p>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Virtual Internship Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
