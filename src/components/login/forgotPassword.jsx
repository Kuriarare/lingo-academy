import { useState } from 'react';
import { FiMail, FiCheckCircle, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: 'loading', message: 'Sending reset link...' });
    
    try {
      const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setStatus({ 
        type: 'success', 
        message: `If an account exists for ${email}, you'll receive password reset instructions shortly.`
      });
      setEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Failed to send reset link. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status.type === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-96 transform transition-all">
          <div className="text-center space-y-6 animate-fade-in">
            <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pop-in" />
            <h2 className="text-2xl font-bold text-gray-800">Reset Link Sent!</h2>
            <p className="text-gray-600 px-4">{status.message}</p>
            <div className="pt-4">
              <a
                href="/login"
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                          transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FiArrowLeft className="inline-block" />
                Return to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 transform transition-all hover:shadow-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Password Recovery
            </h1>
            <p className="text-gray-600 mt-3">Secure password reset process</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-400 text-xl" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus({ type: 'idle', message: '' });
                }}
                className={`w-full pl-10 pr-4 py-3 border-2 ${
                  status.type === 'error' ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                autoFocus
              />
            </div>

            {status.message && (
              <div className={`p-3 rounded-lg flex items-start gap-2 ${
                status.type === 'error' 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <FiAlertCircle className={`flex-shrink-0 ${
                  status.type === 'error' ? 'text-red-500' : 'text-blue-500'
                }`} />
                <p className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                  {status.message}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg 
                      transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            <span className={`flex items-center justify-center gap-2 ${isLoading ? 'invisible' : 'visible'}`}>
              <FiMail className="text-lg" />
              Send Reset Link
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg 
                  className="animate-spin h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Remember your password?{' '}
            <a
              href="/login"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;