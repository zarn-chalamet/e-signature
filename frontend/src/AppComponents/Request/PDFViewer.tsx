import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import { Download, AlertCircle, Loader } from 'lucide-react';
import type { SignaturePosition } from './types';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PDFViewerProps {
  template: any;
  currentPage: number;
  numPages: number;
  pdfLoading: boolean;
  pdfError: string | null;
  processedFileUrl: string | null;
  signaturePositions: SignaturePosition[];
  isAddingSignature: boolean;
  onPageChange: (page: number) => void;
  onDocumentLoadSuccess: (numPages: number) => void;
  onDocumentLoadError: (error: Error) => void;
  onAddSignature: (e: React.MouseEvent<HTMLDivElement>, page: number) => void;
  onRetry: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  template,
  currentPage,
  numPages,
  pdfLoading,
  pdfError,
  processedFileUrl,
  signaturePositions,
  isAddingSignature,
  onPageChange,
  onDocumentLoadSuccess,
  onDocumentLoadError,
  onAddSignature,
  onRetry,
}) => {
  return (
    <div className="border-2 border-gray-200 rounded-xl p-5 mb-4 bg-white">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-semibold text-gray-800 text-lg">{template.title}</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1 || pdfLoading}
            className="px-3 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors duration-150"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-600">
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(numPages, currentPage + 1))}
            disabled={currentPage >= numPages || pdfLoading}
            className="px-3 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors duration-150"
          >
            Next
          </button>
          <a 
            href={processedFileUrl || ''}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-150 flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </a>
        </div>
      </div>
      
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-auto max-h-96 flex justify-center bg-gray-50">
        {pdfLoading && (
          <motion.div 
            className="flex items-center justify-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader className="h-8 w-8 animate-spin text-blue-500 mr-3" />
            <span className="text-gray-600">Loading PDF...</span>
          </motion.div>
        )}
        
        {pdfError && (
          <motion.div 
            className="flex flex-col items-center justify-center h-64 text-red-500 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="h-12 w-12 mb-3" />
            <p className="text-center max-w-sm font-medium mb-2">
              {pdfError}
            </p>
            <p className="text-sm text-gray-500 mb-4 text-center">
              File URL: {template.fileUrl}
            </p>
            <button 
              onClick={onRetry}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors duration-150"
            >
              Retry Loading
            </button>
          </motion.div>
        )}
        
        {!pdfLoading && !pdfError && processedFileUrl && (
          <motion.div 
            className="relative"
            onClick={(e) => onAddSignature(e, currentPage)}
            style={{ cursor: isAddingSignature ? 'crosshair' : 'default' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Document
              file={processedFileUrl}
              onLoadSuccess={({ numPages }) => onDocumentLoadSuccess(numPages)}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-64">
                  <Loader className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              }
            >
              <Page 
                pageNumber={currentPage} 
                scale={1.3}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            
            {/* Signature Markers for current page */}
            {signaturePositions
              .filter(pos => pos.page === currentPage)
              .map((pos, index) => (
                <motion.div
                  key={index}
                  className="absolute w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                />
              ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;