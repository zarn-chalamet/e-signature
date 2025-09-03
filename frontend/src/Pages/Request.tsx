import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Check, FileText, UserPlus, AlertCircle, Loader, Download } from 'lucide-react';
import { createRequest } from '@/apiEndpoints/Signature';

// Configure PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface SignaturePosition {
  page: number;
  x: number;
  y: number;
}

interface Recipient {
  userId: string;
  signed: boolean;
  signaturePositions: SignaturePosition[];
}

interface Template {
  id: string;
  uploaderId: string;
  uploadedAt: string;
  title: string;
  fileUrl: string;
  frequency: string;
  public: boolean;
}

interface User {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUrl: string | null;
  createdAt: string;
  recentTemplates: Template[] | null;
  restricted: boolean;
}

const Request = () => {
  const allUsers = useSelector((state: any) => state.allUsers.allUsers) as User[];
  const publicTemplates = useSelector((state: any) => state.publicTemplates.publicTemplates) as Template[];
  const privateTemplates = useSelector((state: any) => state.privateTemplates) as Template[];

  // State for the form
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [title, setTitle] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [signaturePositions, setSignaturePositions] = useState<SignaturePosition[]>([]);
  const [isAddingSignature, setIsAddingSignature] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  
  // PDF states
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [pdfScale, setPdfScale] = useState(1.3);

  // Filter templates based on active tab
  const templates = activeTab === 'public' ? publicTemplates : privateTemplates;

  // FIXED: Only allow user search when template is selected
  useEffect(() => {
    if (searchTerm.length > 2 && allUsers && Array.isArray(allUsers) && selectedTemplate) {
      const results = allUsers.filter((user: User) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !recipients.some(r => r.userId === user.id) // Exclude already added recipients
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allUsers, selectedTemplate, recipients]);

  // Handle PDF document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
    setCurrentPage(1);
  };

  // Handle PDF document load error
  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setPdfLoading(false);
    setPdfError('Failed to load PDF. Please check if the file exists and is accessible.');
  };

  // IMPROVED: Template selection with proper file URL handling
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPdfError(null);
    setPdfLoading(false);
    
    // Convert local file path to proper URL if needed
    let fileUrl = template.fileUrl;
    
    // FIXED: Handle local file paths and ensure full URL
    if (fileUrl.startsWith('/Users/') || fileUrl.startsWith('C:\\')) {
      // This is a local file path - need to convert to server URL
      const filename = fileUrl.split('/').pop() || fileUrl.split('\\').pop();
      fileUrl = `/api/files/${filename}`;
      console.warn(`Converting local file path to server URL: ${fileUrl}`);
    }
    
    // ALWAYS ensure we have the full URL with backend server
    const backendUrl = import.meta.env?.VITE_API_URL || 'http://localhost:8080';
    
    if (fileUrl.startsWith('/api/')) {
      fileUrl = `${backendUrl}${fileUrl}`;
    } else if (!fileUrl.startsWith('http')) {
      // Handle any other relative URLs
      fileUrl = `${backendUrl}/api/files/${fileUrl}`;
    }
    
    console.log(`Final PDF URL: ${fileUrl}`);
    
    // Set the processed file URL
    setProcessedFileUrl(fileUrl);
    
    // Update the template with proper URL
    setSelectedTemplate({
      ...template,
      fileUrl
    });
  };

  // Handle adding signature position
  const handleAddSignature = (e: React.MouseEvent<HTMLDivElement>, page: number) => {
    if (!isAddingSignature || !selectedRecipient) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPosition: SignaturePosition = {
      page,
      x,
      y,
    };

    setSignaturePositions([...signaturePositions, newPosition]);
  };

  // Handle applying signature positions to recipient
  const handleApplySignature = () => {
    if (!selectedRecipient || signaturePositions.length === 0) return;

    const newRecipient: Recipient = {
      userId: selectedRecipient.id,
      signed: false,
      signaturePositions: [...signaturePositions],
    };

    setRecipients([...recipients, newRecipient]);
    setSelectedRecipient(null);
    setSearchTerm('');
    setSignaturePositions([]);
    setIsAddingSignature(false);
  };

  // IMPROVED: Form submission with better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplate || recipients.length === 0) {
      alert('Please select a template and add at least one recipient');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData = {
        title,
        templateId: selectedTemplate.id,
        emailSubject,
        emailMessage,
        recipients,
      };

      const result = await createRequest(requestData);
      
      if ('message' in result) {
        alert(`Error: ${result.message}`);
      } else {
        alert('Request created successfully!');
        // Reset form
        setSelectedTemplate(null);
        setRecipients([]);
        setTitle('');
        setEmailSubject('');
        setEmailMessage('');
        setSearchTerm('');
        setSelectedRecipient(null);
        setSignaturePositions([]);
        setProcessedFileUrl(null);
      }
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Error creating request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ADDED: Clear search when no template selected
  useEffect(() => {
    if (!selectedTemplate) {
      setSearchTerm('');
      setSearchResults([]);
      setSelectedRecipient(null);
      setSignaturePositions([]);
      setProcessedFileUrl(null);
    }
  }, [selectedTemplate]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold text-gray-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Signature Request
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Template Selection */}
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4">Select a Template</h2>
            
            {/* Template Type Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'public' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('public')}
              >
                Public Templates
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'private' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('private')}
              >
                Private Templates
              </button>
            </div>
            
            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {templates && Array.isArray(templates) && templates.length > 0 ? (
                  templates.map((template: Template) => (
                    <motion.div
                      key={template.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:shadow-md'}`}
                      onClick={() => handleTemplateSelect(template)}
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-medium">{template.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500">Uploaded: {new Date(template.uploadedAt).toLocaleDateString()}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500 py-8">
                    No {activeTab} templates available
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Form Fields */}
            {selectedTemplate && (
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4">Request Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Request Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter request title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email subject"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Message
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email message"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - PDF Viewer and Recipient Management */}
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {selectedTemplate ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Add Signers</h2>
                
                {/* IMPROVED: Recipient Search with better UX */}
                <div className="relative mb-4">
                  <div className="flex items-center">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={selectedTemplate ? "Search users by email" : "Select a template first"}
                      disabled={!selectedTemplate}
                    />
                  </div>
                  
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((user: User) => (
                        <div
                          key={user.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => setSelectedRecipient(user)}
                        >
                          <img
                            src={user.imageUrl || '/default-avatar.png'}
                            alt={user.email}
                            className="h-8 w-8 rounded-full mr-3"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-avatar.png';
                            }}
                          />
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* No results message */}
                  {searchTerm.length > 2 && searchResults.length === 0 && selectedTemplate && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
                      No users found matching "{searchTerm}"
                    </div>
                  )}
                </div>
                
                {/* Selected Recipient */}
                {selectedRecipient && (
                  <motion.div 
                    className="mb-4 p-3 bg-blue-50 rounded-md flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center">
                      <img
                        src={selectedRecipient.imageUrl || '/default-avatar.png'}
                        alt={selectedRecipient.email}
                        className="h-10 w-10 rounded-full mr-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                        }}
                      />
                      <div>
                        <p className="font-medium">{selectedRecipient.firstName} {selectedRecipient.lastName}</p>
                        <p className="text-sm text-gray-500">{selectedRecipient.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRecipient(null);
                        setSignaturePositions([]);
                        setIsAddingSignature(false);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}
                
                {/* FIXED: PDF Viewer with react-pdf for signature positioning */}
                <div className="border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">{selectedTemplate.title}</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1 || pdfLoading}
                        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm">
                        Page {currentPage} of {numPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                        disabled={currentPage >= numPages || pdfLoading}
                        className="px-2 py-1 bg-gray-100 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                      <a 
                        href={processedFileUrl || ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                  
                  <div className="relative border rounded overflow-auto max-h-96 flex justify-center">
                    {pdfLoading && (
                      <div className="flex items-center justify-center h-64">
                        <Loader className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600">Loading PDF...</span>
                      </div>
                    )}
                    
                    {pdfError && (
                      <div className="flex flex-col items-center justify-center h-64 text-red-500">
                        <AlertCircle className="h-12 w-12 mb-2" />
                        <p className="text-center max-w-sm">
                          {pdfError}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          File URL: {selectedTemplate.fileUrl}
                        </p>
                        <button 
                          onClick={() => handleTemplateSelect(selectedTemplate)}
                          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                    
                    {!pdfLoading && !pdfError && processedFileUrl && (
                      <>
                        <div 
                          className="relative"
                          onClick={(e) => handleAddSignature(e, currentPage)}
                          style={{ cursor: isAddingSignature ? 'crosshair' : 'default' }}
                        >
                          <Document
                            file={processedFileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading={<div className="flex items-center justify-center h-64"><Loader className="h-8 w-8 animate-spin text-blue-500" /></div>}
                          >
                            <Page 
                              pageNumber={currentPage} 
                              scale={pdfScale}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </Document>
                          
                          {/* Signature Markers for current page */}
                          {signaturePositions
                            .filter(pos => pos.page === currentPage)
                            .map((pos, index) => (
                              <div
                                key={index}
                                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"
                                style={{
                                  left: `${pos.x}px`,
                                  top: `${pos.y}px`,
                                  transform: 'translate(-50%, -50%)',
                                }}
                              />
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Signature Controls */}
                  {selectedRecipient && !pdfError && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => setIsAddingSignature(!isAddingSignature)}
                          className={`px-3 py-2 rounded-md mr-2 ${isAddingSignature ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                          disabled={pdfLoading}
                        >
                          {isAddingSignature ? 'Cancel Placement' : 'Add Signature'}
                        </button>
                        {isAddingSignature && (
                          <p className="text-sm text-gray-500">Click on the document to place signature</p>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleApplySignature}
                        disabled={signaturePositions.length === 0 || pdfLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Apply
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Added Recipients */}
                {recipients.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Signers ({recipients.length})</h3>
                    <div className="space-y-2">
                      {recipients.map((recipient, index) => {
                        const user = allUsers.find((u: User) => u.id === recipient.userId);
                        return (
                          <motion.div 
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="flex items-center">
                              <UserPlus className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                              <span className="text-sm text-gray-500 ml-2">({user?.email})</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">
                                {recipient.signaturePositions.length} signature{recipient.signaturePositions.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setRecipients(recipients.filter((_, i) => i !== index));
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={recipients.length === 0 || isSubmitting || !title || !emailSubject || !emailMessage}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        Sending Request...
                      </>
                    ) : (
                      'Send Signature Request'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <FileText className="h-16 w-16 mb-4 opacity-50" />
                <p>Select a template to get started</p>
                <p className="text-sm mt-2 text-center max-w-sm">
                  Choose a public or private template from the left panel to begin adding signers
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Request;