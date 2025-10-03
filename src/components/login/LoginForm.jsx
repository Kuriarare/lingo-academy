import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  userStatus,
  userError,
}) => {
  return (
    <div className="w-full md:w-1/3 max-w-md bg-[#161625] rounded-2xl p-8 shadow-2xl border border-purple-500/20 md:mt-0 mt-5">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        Welcome to <br className="md:hidden" />
        <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
          Lingolandias
        </span>
      </h1>

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email Input */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            className="w-full px-4 py-3 bg-[#2a2a3e] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all placeholder-gray-500"
            type="email"
            placeholder="languagelearner@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Password
          </label>
          <input
            className="w-full px-4 py-3 bg-[#2a2a3e] border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all placeholder-gray-500"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-gray-400">
            <input
              type="checkbox"
              className="rounded border-gray-500 text-purple-500 focus:ring-purple-500 bg-gray-800"
            />
            <span className="ml-2 text-sm">Remember me</span>
          </label>
          <Link
            to="/forgotpassword"
            className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={userStatus === "loading"}
          className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center shadow-lg hover:shadow-purple-500/20 text-lg"
        >
          {userStatus === "loading" ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Unlocking Knowledge...
            </>
          ) : (
            "Begin Learning Journey"
          )}
        </button>

        {/* Error Message */}
        {userStatus === "failed" && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {userError || "Hmm, those credentials don't look right. Please try again!"}
          </div>
        )}
      </form>
    </div>
  );
};
LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  userStatus: PropTypes.string,
  userError: PropTypes.string,
};

export default LoginForm;