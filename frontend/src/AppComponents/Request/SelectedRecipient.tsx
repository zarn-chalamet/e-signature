import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User } from './types';

interface SelectedRecipientProps {
  recipient: User;
  onRemove: () => void;
}

const SelectedRecipient: React.FC<SelectedRecipientProps> = ({ recipient, onRemove }) => {
  return (
    <motion.div 
      className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-between border border-blue-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center">
        <img
          src={recipient.imageUrl || '/default-avatar.png'}
          alt={recipient.email}
          className="h-12 w-12 rounded-full mr-4 border-2 border-white shadow-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-avatar.png';
          }}
        />
        <div>
          <p className="font-semibold text-gray-800">{recipient.firstName} {recipient.lastName}</p>
          <p className="text-sm text-gray-600">{recipient.email}</p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150 hover:bg-gray-100 rounded-full"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

export default SelectedRecipient;