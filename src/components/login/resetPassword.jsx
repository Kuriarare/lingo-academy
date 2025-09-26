import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/verify-reset-token/${token}`);
        if (!response.ok) throw new Error('Invalid token');
        
        const userData = await response.json();
        setUser(userData.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid or expired token');
      }
    };
    
    if (token) verifyToken();
    else setError('Missing reset token');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Password reset failed");

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = password === confirmPassword;
  const showPasswordError = passwordTouched && password.length < 8;
  const showConfirmError = confirmTouched && !passwordsMatch;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
        <div className="max-w-md w-full mx-4 bg-white rounded-xl shadow-lg p-8 my-20">
          <div className="text-center space-y-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Error Occurred</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
        <div className="max-w-md w-full mx-4 bg-white rounded-xl shadow-lg p-8 my-20">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="mt-4 text-center text-gray-600">Verifying your security token...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
        <div className="max-w-md w-full mx-4 bg-white rounded-xl shadow-lg p-8 my-20">
          <div className="text-center space-y-6">
            <div className="animate-scale-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Password Updated!</h2>
            <p className="text-gray-600">
              Redirecting to login in <span className="font-medium text-purple-600">5 seconds</span>...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-400">
      <div className="max-w-md w-full mx-4 bg-white rounded-xl shadow-lg p-8 my-20 transform transition-all hover:shadow-xl">
        <div className="space-y-1 mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Reset Your Password
          </h1>
          <p className="text-gray-600">Hello <span className="font-medium">{user.name}</span>, let&apos;s get you a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordTouched(true);
              }}
              className={`w-full px-4 py-3 border ${
                showPasswordError ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              placeholder="Minimum 8 characters"
              required
              minLength={8}
            />
            {showPasswordError && (
              <p className="mt-1 text-sm text-red-500">Password must be at least 8 characters</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmTouched(true);
              }}
              className={`w-full px-4 py-3 border ${
                showConfirmError ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              placeholder="Re-enter your password"
              required
              minLength={8}
            />
            {showConfirmError && (
              <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;