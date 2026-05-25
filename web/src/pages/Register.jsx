import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Mail, Lock, User, GraduationCap, CalendarDays, ArrowRight, Sun, Moon, Rocket } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [program, setProgram] = useState('BS in Software Engineering');
  const [type, setType] = useState('Regular');
  const [batch, setBatch] = useState('2024-2028');
  const [semester, setSemester] = useState('2');
  
  // Teacher-specific registration states
  const [department, setDepartment] = useState('Software Engineering');
  const [designation, setDesignation] = useState('Lecturer');
  const [employeeId, setEmployeeId] = useState('');
  const [facultyKey, setFacultyKey] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const register = useStore((state) => state.register);
  const themeMode = useStore((state) => state.themeMode);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.body.classList.add('no-scrollbar');
    document.documentElement.classList.add('no-scrollbar');
    return () => {
      document.body.classList.remove('no-scrollbar');
      document.documentElement.classList.remove('no-scrollbar');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !fullName || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (role === 'student' && !/^\d{4}-\d{4}$/.test(batch)) {
      setError('Session / Batch must be in YYYY-YYYY format (e.g., 2024-2028)');
      return;
    }

    if (role === 'teacher') {
      if (!department || !designation || !employeeId || !facultyKey) {
        setError('Please fill in all faculty details including Faculty ID and Security Key');
        return;
      }
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        fullName,
        password,
        role
      };

      if (role === 'student') {
        payload.program = program;
        payload.type = type;
        payload.batch = batch;
        payload.semester = Number(semester);
      } else {
        payload.department = department;
        payload.designation = designation;
        payload.employeeId = employeeId;
        payload.facultyKey = facultyKey;
      }

      await register(email, payload);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Registration failed. User may already exist.');
    }
  };

  return (
    <div className="no-scrollbar" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--auth-bg)',
      padding: '2.5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Video with Dark/Light Ambient Filter Overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <source src="/uos.mp4" type="video/mp4" />
      </video>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: themeMode === 'dark' ? 'rgba(6, 8, 20, 0.65)' : 'rgba(241, 245, 249, 0.55)',
        backdropFilter: 'blur(8px)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Floating Theme Toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 100 }}>
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            padding: '0.5rem',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px var(--glass-shadow)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.boxShadow = '0 0 15px var(--accent-glow)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.boxShadow = '0 4px 12px var(--glass-shadow)';
          }}
          title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {themeMode === 'dark' ? (
            <Sun size={18} color="var(--warning)" />
          ) : (
            <Moon size={18} color="var(--accent-primary)" />
          )}
        </button>
      </div>

      {/* Main Split Container */}
      <div className="auth-container animate-fade-in" style={{ zIndex: 10 }}>
        
        <div className="auth-left-panel">
          {/* Animated Ambient Blobs */}
          <div className="auth-ambient-blob blob-1"></div>
          <div className="auth-ambient-blob blob-2"></div>
          <div className="auth-ambient-blob blob-3"></div>

          <div className="auth-left-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
            <span className="auth-welcome-lbl" style={{ textAlign: 'center' }}>Welcome to</span>
            <div className="auth-brand-logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', marginBottom: '1.5rem', width: '100%' }}>
              <img 
                src="/uos.png" 
                alt="UOS Logo" 
                className="auth-left-logo-animate"
                style={{ 
                  width: '72px', 
                  height: '72px', 
                  objectFit: 'contain', 
                  filter: 'drop-shadow(0 4px 15px rgba(255, 255, 255, 0.35))'
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', textAlign: 'center' }}>
                <h1 className="auth-brand-name" style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800 }}>UOS</h1>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Smart Campus Timetable Assistant
                </span>
              </div>
            </div>
            <p className="auth-brand-desc" style={{ fontSize: '0.95rem', lineHeight: '1.65', color: 'rgba(255, 255, 255, 0.85)', maxWidth: '340px', textAlign: 'justify', margin: '0 auto' }}>
              Navigate your academic day with absolute clarity. Track your schedules in real-time, discover unoccupied lecture halls instantly, and unlock effortless campus coordination built exclusively for UOS CS, SE, and IT.
            </p>
          </div>
          <div className="auth-left-footer">
            <span>UOS COMPUTING</span>
            <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>|</span>
            <span>DESIGN SYSTEM</span>
          </div>
        </div>

        {/* Cloudy Vector Wave Transition Divider */}
        <div className="auth-wave-divider">
          <svg viewBox="0 0 100 800" preserveAspectRatio="none" style={{ height: '100%', width: '100%', display: 'block' }}>
            <path className="auth-wave-layer-3" d="M100,0 L20,0 C20,0 40,100 10,200 C-20,300 30,400 10,500 C-10,600 40,700 20,800 L100,800 Z" />
            <path className="auth-wave-layer-2" d="M100,0 L30,0 C30,0 15,90 35,180 C55,270 25,360 45,450 C65,540 25,630 35,720 C45,800 35,800 35,800 L100,800 Z" />
            <path className="auth-wave-layer-1" d="M100,0 L45,0 C45,0 30,80 50,160 C70,240 40,320 60,400 C80,480 50,560 70,640 C90,720 55,800 55,800 L100,800 Z" />
          </svg>
        </div>

        {/* Right Form Input Panel */}
        <div className="auth-right-panel" style={{ padding: '2.5rem 3.5rem' }}>
          <div className="auth-form-wrapper">
            
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {role === 'student' ? 'Create Student Profile' : 'Create Teacher Profile'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {role === 'student' 
                  ? 'Establish your academic details to align your parsed timetable' 
                  : 'Enter your credentials to manage your teacher schedule'}
              </p>
            </div>

            {/* Role Segmented Selector */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '12px',
              padding: '0.25rem',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'student' ? 'var(--accent-primary)' : 'transparent',
                  color: role === 'student' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
                onClick={() => setRole('student')}
              >
                <GraduationCap size={15} />
                Student
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'teacher' ? 'var(--accent-primary)' : 'transparent',
                  color: role === 'teacher' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
                onClick={() => setRole('teacher')}
              >
                <User size={15} />
                Teacher
              </button>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                textAlign: 'left'
              }}>
                {error}
              </div>
            )}

            {/* Inputs Form */}
            <form onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div className="auth-input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="auth-input-label" htmlFor="reg-name">Full Name</label>
                <input 
                  id="reg-name"
                  type="text" 
                  className="auth-input-field" 
                  placeholder={role === 'student' ? "Ahmed Ali" : "Dr. Afzal Badshah"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email Address */}
              <div className="auth-input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="auth-input-label" htmlFor="reg-email">Email Address</label>
                <input 
                  id="reg-email"
                  type="email" 
                  className="auth-input-field" 
                  placeholder={role === 'student' ? 'student@gmail.com' : 'teacher@gmail.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="auth-input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="auth-input-label" htmlFor="reg-password">Security Password</label>
                <input 
                  id="reg-password"
                  type="password" 
                  className="auth-input-field" 
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Conditional Fields for Student */}
              {role === 'student' && (
                <div className="animate-fade-in" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderTop: '1px solid var(--glass-border)',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {/* Program & Support Type */}
                  <div className="register-row-grid-2col" style={{ gap: '0.75rem' }}>
                    <div className="auth-input-group" style={{ marginBottom: 0 }}>
                      <label className="auth-input-label" htmlFor="program">Degree Program</label>
                      <select 
                        id="program"
                        className="auth-input-field select-field" 
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        style={{ borderBottom: '2px solid var(--glass-border) !important' }}
                      >
                        <option value="BS in Software Engineering">BS Software Eng.</option>
                        <option value="BS in Computer Science">BS Computer Sci.</option>
                        <option value="BS in Information Technology">BS Info. Tech.</option>
                        <option value="BS in Artificial Intelligence">BS Artificial Intelligence</option>
                        <option value="BS in Data Science">BS Data Science</option>
                        <option value="BS in Cyber Security">BS Cyber Security</option>
                        <option value="MS in Software Engineering">MS Software Eng.</option>
                        <option value="MS in Computer Science">MS Computer Sci.</option>
                        <option value="MS in Information Technology">MS Info. Tech.</option>
                        <option value="MS in Artificial Intelligence">MS Artificial Intelligence</option>
                        <option value="MS in Data Science">MS Data Science</option>
                        <option value="MS in Cyber Security">MS Cyber Security</option>
                        <option value="PhD in Software Engineering">PhD Software Eng.</option>
                        <option value="PhD in Computer Science">PhD Computer Sci.</option>
                        <option value="PhD in Information Technology">PhD Info. Tech.</option>
                        <option value="PhD in Artificial Intelligence">PhD Artificial Intelligence</option>
                        <option value="PhD in Data Science">PhD Data Science</option>
                        <option value="PhD in Cyber Security">PhD Cyber Security</option>
                      </select>
                    </div>

                    <div className="auth-input-group" style={{ marginBottom: 0 }}>
                      <label className="auth-input-label">Support Type</label>
                      <div style={{ display: 'flex', gap: '0.25rem', height: '100%', alignItems: 'center' }}>
                        {['Regular', 'Self 1', 'Self 2'].map((t, idx) => {
                          const realVal = idx === 0 ? 'Regular' : (idx === 1 ? 'Self Support 1' : 'Self Support 2');
                          const active = type === realVal;
                          return (
                            <button 
                              key={t}
                              type="button"
                              className="btn"
                              style={{ 
                                flex: idx === 0 ? 1.2 : 1, 
                                padding: '0.45rem 0.15rem', 
                                fontSize: '0.75rem',
                                background: active ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                color: active ? '#ffffff' : 'var(--text-secondary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease'
                              }}
                              onClick={() => setType(realVal)}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Batch & Semester */}
                  <div className="register-row-grid-equal" style={{ gap: '0.75rem' }}>
                    <div className="auth-input-group" style={{ marginBottom: 0 }}>
                      <label className="auth-input-label" htmlFor="batch">Session / Batch</label>
                      <input 
                        id="batch"
                        type="text" 
                        className="auth-input-field" 
                        placeholder="e.g. 2024-2028"
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                      />
                    </div>

                    <div className="auth-input-group" style={{ marginBottom: 0 }}>
                      <label className="auth-input-label" htmlFor="semester">Active Semester</label>
                      <select 
                        id="semester"
                        className="auth-input-field select-field" 
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Fields for Teacher */}
              {role === 'teacher' && (
                <div className="animate-fade-in" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderTop: '1px solid var(--glass-border)',
                  paddingTop: '1rem',
                  marginTop: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  {/* Department & Designation */}
                  <div className="register-row-grid-equal" style={{ gap: '0.75rem' }}>
                    <div className="auth-input-group" style={{ marginBottom: 0 }}>
                      <label className="auth-input-label" htmlFor="department">Department</label>
                      <select 
                        id="department"
                        className="auth-input-field select-field"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Software Engineering">Software Eng.</option>
                        <option value="Information Technology">Info. Tech.</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Cyber Security">Cyber Security</option>
                      </select>
                    </div>

                    <div className="auth-input-group" style={{ marginBottom: 0 }}>
                      <label className="auth-input-label" htmlFor="designation">Designation</label>
                      <select 
                        id="designation"
                        className="auth-input-field select-field"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                      >
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Prof.</option>
                        <option value="Assistant Professor">Assistant Prof.</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Visiting Faculty">Visiting Faculty</option>
                      </select>
                    </div>
                  </div>

                  {/* Employee ID & Access Key */}
                  <div className="register-row-grid-equal" style={{ gap: '0.75rem' }}>
                    <div className="auth-input-group" style={{ marginBottom: 0 }}>
                      <label className="auth-input-label" htmlFor="employee-id">Faculty Employee ID</label>
                      <input 
                        id="employee-id"
                        type="text" 
                        className="auth-input-field" 
                        placeholder="e.g. EMP-9921"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                      />
                    </div>

                    <div className="auth-input-group" style={{ marginBottom: 0 }}>
                      <label className="auth-input-label" htmlFor="faculty-key">Access Key</label>
                      <input 
                        id="faculty-key"
                        type="password" 
                        className="auth-input-field" 
                        placeholder="Faculty Security Key"
                        value={facultyKey}
                        onChange={(e) => setFacultyKey(e.target.value)}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', marginTop: '0.25rem', display: 'block', opacity: 0.85 }}>
                        Demo key: <code style={{ background: 'var(--bg-tertiary)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.7rem' }}>UOS_FACULTY_2026</code>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Checkbox Row */}
              <div className="auth-checkbox-row" style={{ marginTop: '0.75rem' }}>
                <input type="checkbox" id="agree-terms" className="auth-checkbox" defaultChecked />
                <label htmlFor="agree-terms" className="auth-checkbox-label">
                  By Signing Up, I agree with Terms & Conditions
                </label>
              </div>

              {/* Pill Button Row */}
              <div className="btn-pill-row" style={{ marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  className="btn-pill-primary"
                  disabled={isLoading}
                  style={{ flex: 1.4 }}
                >
                  {isLoading ? 'Registering...' : (
                    <>
                      Sign Up <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn-pill-secondary"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
