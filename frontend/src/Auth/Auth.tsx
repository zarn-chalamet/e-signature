import { getUserProfile, login } from "@/apiEndpoints/Auth";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/Store/slices/UserSlice";
import { toast } from "sonner";
import { motion, AnimatePresence, type Variants } from "framer-motion";

type authMode = "login" | "adminlogin";

interface LoginFormData {
  email: string;
  password: string;
}

interface AdminLoginFormData extends LoginFormData {
  email: string;
  adminCode: string;
  password: string;
}

const Auth = () => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState<authMode>("login");
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [adminLoginData, setAdminLoginData] = useState<AdminLoginFormData>({
    email: "",
    adminCode: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (mode == "login") {
      setLoginData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setAdminLoginData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        console.log(loginData);
        const response = await login(loginData);
        if (response.token) {
          const userData = await getUserProfile();
          if ("message" in userData) {
            toast.error("Error getting userInfo");
          } else {
            dispatch(setUser(userData));
            navigate("/");
          }
        }
      } else {
        console.log(adminLoginData);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "adminlogin" : "login"));
    setError(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const switchVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="w-full max-w-md"
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated header with mode toggle */}
          <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative">
            <AnimatePresence mode="wait">
              <motion.h2 
                key={mode}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-light mb-2"
              >
                {mode === "login" ? "User Login" : "Admin Portal"}
              </motion.h2>
            </AnimatePresence>
            <p className="text-gray-300 text-sm font-light">
              {mode === "login" 
                ? "Access your personal account" 
                : "Administrator secure access"}
            </p>
            
            {/* Mode toggle */}
            <motion.div 
              className="absolute top-6 right-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={toggleMode}
                className="text-xs bg-white text-gray-900 bg-opacity-10 backdrop-blur-sm px-3 py-1 rounded-full border border-white border-opacity-20 hover:bg-opacity-20 transition-all"
              >
                {mode === "login" ? "Admin →" : "← User"}
              </button>
            </motion.div>
          </div>

          <div className="p-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {mode === "adminlogin" && (
                <motion.div variants={itemVariants} className="space-y-1">
                  <label
                    htmlFor="adminCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Admin Code
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    id="adminCode"
                    name="adminCode"
                    type="text"
                    required
                    value={adminLoginData.adminCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-800 focus:border-transparent transition-all"
                    placeholder="Enter admin access code"
                  />
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={mode === "login" ? loginData.email : adminLoginData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-800 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <motion.a
                    whileHover={{ x: 2 }}
                    href="#"
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Forgot password?
                  </motion.a>
                </div>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="password"
                  name="password"
                  type="password"
                  value={mode === "login" ? loginData.password : adminLoginData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-800 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center justify-center relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Authenticating...
                      </motion.div>
                    ) : (
                      <motion.span 
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {mode === "login" ? "Sign In" : "Admin Login"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Animated button background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ zIndex: -1 }}
                  />
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.div 
              className="mt-6 text-center border-t border-gray-100 pt-5"
              variants={switchVariants}
            >
              <motion.button
                onClick={toggleMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors flex items-center justify-center w-full"
              >
                <span>
                  {mode === "login" 
                    ? "Need administrator access?" 
                    : "Return to user login"}
                </span>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  animate={{ x: mode === "login" ? 2 : -2 }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 0.5 
                  }}
                >
                  {mode === "login" ? (
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  )}
                </motion.svg>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        <motion.p 
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Secure authentication system • {new Date().getFullYear()}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Auth;