import React from 'react';
import { motion } from 'framer-motion';

interface RequestFormProps {
  title: string;
  emailSubject: string;
  emailMessage: string;
  onTitleChange: (value: string) => void;
  onEmailSubjectChange: (value: string) => void;
  onEmailMessageChange: (value: string) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({
  title,
  emailSubject,
  emailMessage,
  onTitleChange,
  onEmailSubjectChange,
  onEmailMessageChange,
}) => {
  return (
    <motion.div 
      className="mt-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Request Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Request Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter request title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Subject
          </label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => onEmailSubjectChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter email subject"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Message
          </label>
          <textarea
            value={emailMessage}
            onChange={(e) => onEmailMessageChange(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter email message"
            required
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RequestForm;