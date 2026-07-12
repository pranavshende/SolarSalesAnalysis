import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { motion } from 'framer-motion';

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

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AuthLayout 
      title="Join SolarIntel" 
      subtitle="Start optimizing your solar sales strategy"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="space-y-1">
          <label className="text-xs font-medium text-dark-300 ml-1 uppercase tracking-wider">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-solar-500 transition-colors" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-dark-950/50 border border-dark-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-dark-600 focus:border-solar-500 focus:ring-2 focus:ring-solar-500/20 transition-all outline-none"
              placeholder="John Doe"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }} className="space-y-1">
          <label className="text-xs font-medium text-dark-300 ml-1 uppercase tracking-wider">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-solar-500 transition-colors" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-dark-950/50 border border-dark-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-dark-600 focus:border-solar-500 focus:ring-2 focus:ring-solar-500/20 transition-all outline-none"
              placeholder="john@solarcorp.com"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }} className="space-y-1">
          <label className="text-xs font-medium text-dark-300 ml-1 uppercase tracking-wider">Role</label>
          <div className="relative group">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-solar-500 transition-colors" />
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-dark-950/50 border border-dark-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-solar-500 focus:ring-2 focus:ring-solar-500/20 transition-all outline-none appearance-none"
            >
              <option value="Admin">Admin</option>
              <option value="Analyst">Analyst</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Investor">Investor</option>
            </select>
            {/* Custom dropdown arrow to replace the default one */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-dark-500 group-focus-within:text-solar-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.9 }} className="space-y-1">
          <label className="text-xs font-medium text-dark-300 ml-1 uppercase tracking-wider">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-solar-500 transition-colors" />
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-dark-950/50 border border-dark-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-dark-600 focus:border-solar-500 focus:ring-2 focus:ring-solar-500/20 transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 1.0 }} className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-400 hover:to-solar-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-solar-500/25 hover:shadow-solar-500/40 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </motion.div>
      </form>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-6 text-dark-400 text-sm"
      >
        Already have an account?{' '}
        <Link to="/login" className="text-solar-400 hover:text-solar-300 font-bold ml-1 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-solar-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
          Sign In
        </Link>
      </motion.p>
    </AuthLayout>
  );
};

export default Signup;
