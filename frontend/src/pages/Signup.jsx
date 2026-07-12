import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, ArrowRight, Mail, Lock, User, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Analyst'
  });
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(formData);
      navigate('/login', { state: { email: formData.email, message: 'Account created! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-solar p-3 rounded-2xl w-fit mx-auto mb-6 shadow-xl shadow-solar-500/20">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Join SolarIntel</h1>
          <p className="text-dark-400">Start optimizing your solar sales strategy</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-dark-300 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-solar focus:ring-1 focus:ring-solar transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-dark-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-solar focus:ring-1 focus:ring-solar transition-all"
                  placeholder="john@solarcorp.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-dark-300 ml-1">Role</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-solar focus:ring-1 focus:ring-solar transition-all appearance-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Investor">Investor</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-dark-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-solar focus:ring-1 focus:ring-solar transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-solar hover:bg-solar-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-solar-500/20 disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center mt-6 text-dark-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-solar hover:text-solar-400 font-bold ml-1 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
