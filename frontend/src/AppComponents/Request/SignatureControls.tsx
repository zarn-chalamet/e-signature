import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface SignatureControlsProps {
  isAddingSignature: boolean;
  signaturePositions: any[];
  pdfLoading: boolean;
  onToggleSignature: () => void;
  onApplySignature: () => void;
}

const SignatureControls: React.FC<SignatureControlsProps> = ({
  isAddingSignature,
  signaturePositions,
  pdfLoading,
  onToggleSignature,
  onApplySignature,
}) => {
  if (!pdfLoading) return null;

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center">
        <motion.button
          type="button"
          onClick={onToggleSignature}
          className={`px-4 py-2 rounded-lg mr-3 flex items-center transition-colors duration-150 ${
            isAddingSignature 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={pdfLoading}
        >
          {isAddingSignature ? 'Cancel Placement' : 'Add Signature'}
        </motion.button>
        {isAddingSignature && (
          <motion.p 
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Click on the document to place signature
          </motion.p>
        )}
      </div>
      
      <motion.button
        type="button"
        onClick={onApplySignature}
        disabled={signaturePositions.length === 0 || pdfLoading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 flex items-center hover:bg-green-700 transition-colors duration-150"
      >
        <Check className="h-4 w-4 mr-1" />
        Apply Signature
      </motion.button>
    </div>
  );
};

export default SignatureControls;