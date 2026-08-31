import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Loader, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    UserName: '',
    UserEmail: '',
    UserMobile: '',
    Enrollment: '',
    Password: '',
    UserImage: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:7106/api/User',
        {
          UserName: formData.UserName,
          UserEmail: formData.UserEmail,
          UserMobile: formData.UserMobile,
          Enrollment: formData.Enrollment,
          Password: formData.Password,
          UserImage: formData.UserImage || null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="ambient-glow-1 -top-20 -left-20 animate-pulse" />
      <div className="ambient-glow-2 -bottom-20 -right-20 animate-pulse" />

      {/* Main Glass Container */}
      <div className="w-full max-w-4xl cyan-panel-3d overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px] relative z-10">
        
        {/* Left Side: 3D Visual Section */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10 bg-transparent">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner">
              <Sparkles className="w-4 h-4" />
              <span>Create Account</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">
              Join the Future of <br />
              <span className="text-gradient-cyan">LSRW Learning</span>
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Register your credentials to unlock interactive paragraphs, speech evaluation, and comprehensive assessments.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-3">
              <div className="flex items-center space-x-3 text-sm text-slate-200">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
                <span>Instant Account Activation</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-200">
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
                <span>Real-Time Speech Processing</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 pt-6 border-t border-white/10">
            <span>© {new Date().getFullYear()} LSRW Platform</span>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-transparent">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/30 border border-white/20">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-wide">Create your account</h2>
              <p className="text-slate-400 text-sm mt-1">Fill out the information below to get started</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { name: 'UserName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                { name: 'UserEmail', label: 'Email address', type: 'email', placeholder: 'john@example.com' },
                { name: 'UserMobile', label: 'Mobile Number', type: 'tel', placeholder: '+1 234 567 8900' },
                { name: 'Enrollment', label: 'Enrollment Number', type: 'text', placeholder: 'ENR-2026-001' },
                { name: 'Password', label: 'Password', type: 'password', placeholder: '••••••••' },
                { name: 'UserImage', label: 'Profile Image URL (Optional)', type: 'url', placeholder: 'https://example.com/avatar.jpg' },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.name !== 'UserImage'}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 input-3d text-sm placeholder-slate-500"
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 btn-3d-cyan flex items-center justify-center space-x-2 text-base font-semibold shadow-lg group disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Signing up...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign up</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center space-x-1"
              >
                <span>Already have an account?</span>
                <span className="underline decoration-sky-400/50 underline-offset-4 font-semibold">Sign in</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
