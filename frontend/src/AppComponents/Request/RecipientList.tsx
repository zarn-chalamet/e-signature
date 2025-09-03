import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, X } from 'lucide-react';
import type { Recipient, User } from './types';

interface RecipientListProps {
  recipients: Recipient[];
  allUsers: User[];
  onRemoveRecipient: (index: number) => void;
}

const RecipientList: React.FC<RecipientListProps> = ({ recipients, allUsers, onRemoveRecipient }) => {
  if (recipients.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-gray-800 mb-3 text-lg">Signers ({recipients.length})</h3>
      <div className="space-y-3">
        {recipients.map((recipient, index) => {
          const user = allUsers.find((u: User) => u.id === recipient.userId);
          return (
            <motion.div 
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-800">{user?.firstName} {user?.lastName}</span>
                  <span className="text-sm text-gray-500 ml-2">({user?.email})</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-3">
                    {recipient.signaturePositions.length} signature{recipient.signaturePositions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemoveRecipient(index)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-150 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipientList;