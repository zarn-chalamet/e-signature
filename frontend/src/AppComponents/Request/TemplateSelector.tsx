import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import type { Template, TemplateTab } from './types';

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: Template | null;
  activeTab: TemplateTab;
  onTabChange: (tab: TemplateTab) => void;
  onTemplateSelect: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  activeTab,
  onTabChange,
  onTemplateSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Select a Template</h2>
      
      {/* Template Type Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium transition-all duration-200 ${
            activeTab === 'public' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('public')}
        >
          Public Templates
        </button>
        <button
          className={`py-3 px-6 font-medium transition-all duration-200 ${
            activeTab === 'private' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('private')}
        >
          Private Templates
        </button>
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {templates && templates.length > 0 ? (
            templates.map((template) => (
              <motion.div
                key={template.id}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                  selectedTemplate?.id === template.id 
                    ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => onTemplateSelect(template)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{template.title}</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Uploaded: {new Date(template.uploadedAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-2 text-center text-gray-500 py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No {activeTab} templates available</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TemplateSelector;