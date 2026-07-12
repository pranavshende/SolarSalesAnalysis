import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Solar Intelligence & Sales Optimization Platform"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }} className="space-y-2">
          <label className="text-sm font-medium text-dark-300 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-solar-500 transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-950/50 border border-dark-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-dark-600 focus:border-solar-500 focus:ring-2 focus:ring-solar-500/20 transition-all outline-none"
              placeholder="name@company.com"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.7 }} className="space-y-2">
          <label className="text-sm font-medium text-dark-300 ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-solar-500 transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-950/50 border border-dark-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-dark-600 focus:border-solar-500 focus:ring-2 focus:ring-solar-500/20 transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }}>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-400 hover:to-solar-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-solar-500/25 hover:shadow-solar-500/40 disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </motion.div>
      </form>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-8 text-dark-400 text-sm"
      >
        Don't have an account?{' '}
        <Link to="/signup" className="text-solar-400 hover:text-solar-300 font-bold ml-1 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-solar-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left">
          Create Account
        </Link>
      </motion.p>
    </AuthLayout>
  );
};

export default Login;
