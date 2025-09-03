import React from 'react';
import { motion } from 'framer-motion';
import { Loader, Send } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled: boolean;
  onClick: (e:any) => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, disabled, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-semibold flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {isSubmitting ? (
        <>
          <Loader className="h-5 w-5 animate-spin mr-2" />
          Sending Request...
        </>
      ) : (
        <>
          <Send className="h-5 w-5 mr-2" />
          Send Signature Request
        </>
      )}
    </motion.button>
  );
};

export default SubmitButton;