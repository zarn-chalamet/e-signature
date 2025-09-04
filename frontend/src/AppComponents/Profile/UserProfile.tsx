import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Edit3, 
  Save, 
  X,
  Shield,
  Calendar,
  FileText
} from "lucide-react";

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  recentTemplates: any;
  role: string;
  userId: string;
  createdAt: string;
}

interface UserProfileProps {
  userData: UserData;
  onUpdateProfile?: (updatedData: Partial<UserData>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
  });

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile(editedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    });
    setIsEditing(false);
  };

  const handleChange = (field: keyof typeof editedData, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role.replace('_ROLE', '').replace(/_/g, ' ').toLowerCase();
  };

  // Format the createdAt date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      className="w-full bg-card rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        {/* Profile Header with Edit Button */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {userData.image ? (
                <img
                  src={userData.image}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  className="w-20 h-20 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </motion.div>
            
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {userData.firstName} {userData.lastName}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{userData.email}</span>
              </div>
            </div>
          </div>

          <motion.button
            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
          </motion.button>
        </div>

        {/* Edit Form or User Details */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-stone-900 rounded-lg">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editedData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editedData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <motion.button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4" /> Cancel
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="viewing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              {/* User Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-stone-900 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {formatRole(userData.role)}
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-stone-900 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(userData.createdAt)}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Templates Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <h2 className="font-medium text-gray-900 dark:text-white">Recent Templates</h2>
          </div>
          
          {userData.recentTemplates ? (
            <div className="grid grid-cols-1 gap-3">

            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 dark:bg-stone-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
              <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">No recent templates</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Your recently used templates will appear here</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;



              // <motion.div 
              //   className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              //   whileHover={{ y: -2 }}
              //   transition={{ type: "spring", stiffness: 300 }}
              // >
              //   <h3 className="font-medium text-gray-900 dark:text-white">Project Proposal</h3>
              //   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last modified 2 days ago</p>
              // </motion.div>
              // <motion.div 
              //   className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              //   whileHover={{ y: -2 }}
              //   transition={{ type: "spring", stiffness: 300 }}
              // >
              //   <h3 className="font-medium text-gray-900 dark:text-white">Meeting Notes</h3>
              //   <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last modified 1 week ago</p>
              // </motion.div>