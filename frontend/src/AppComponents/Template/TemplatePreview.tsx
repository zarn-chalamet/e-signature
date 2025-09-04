// TemplatePreview.tsx
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw,
  X,
  Loader2
} from "lucide-react";
import { type template } from "@/apiEndpoints/Templates";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type TemplatePreviewProps = {
  selectedTemplate: template | null;
  fileUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onLoadSuccess: () => void;
  onLoadError: (error: Error) => void;
};

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  selectedTemplate,
  fileUrl,
  isLoading,
  error,
  onLoadSuccess,
  onLoadError,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    onLoadSuccess();
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.25, 3));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
  }

  function rotate() {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  }

  function downloadPdf() {
    if (!fileUrl) return;
    
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = selectedTemplate?.title || 'template.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <AnimatePresence mode="wait">
      {selectedTemplate ? (
        <motion.div
          key="preview"
          className="bg-card rounded-xl shadow-lg border border-border p-6 h-full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold truncate max-w-xs">
                {selectedTemplate.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Uploaded: {new Date(selectedTemplate.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={downloadPdf}
              className="flex items-center text-sm bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
          </div>

          {/* PDF Controls */}
          <div className="flex items-center justify-between bg-muted p-2 rounded-lg mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className="p-1 rounded-md hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <span className="text-sm font-medium">
                Page {pageNumber} of {numPages}
              </span>
              
              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className="p-1 rounded-md hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="p-1 rounded-md hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              
              <span className="text-sm font-medium">
                {Math.round(scale * 100)}%
              </span>
              
              <button
                onClick={zoomIn}
                disabled={scale >= 3}
                className="p-1 rounded-md hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              
              <button
                onClick={rotate}
                className="p-1 rounded-md hover:bg-background transition-colors"
                aria-label="Rotate"
              >
                <RotateCw className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="relative border border-border rounded-lg bg-gray-100 dark:bg-stone-900 overflow-auto max-h-96 flex justify-center items-center min-h-[400px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                  <p className="text-sm text-muted-foreground">Loading PDF...</p>
                </motion.div>
              </div>
            )}
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-6"
              >
                <FileText className="h-12 w-12 text-red-400 mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-1">Failed to load PDF</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </motion.div>
            )}
            
            {fileUrl && !error && (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onLoadError}
                loading={
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                }
                error={
                  <div className="text-center p-6">
                    <FileText className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <h3 className="font-medium text-foreground mb-1">Failed to load PDF</h3>
                    <p className="text-sm text-muted-foreground">Please try again later</p>
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              </Document>
            )}
            
            {!fileUrl && !isLoading && !error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-6"
              >
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground font-medium">Select a template to preview</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="placeholder"
          className="bg-card rounded-xl shadow-lg border border-border p-6 h-full flex items-center justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Template Preview</h3>
            <p className="text-sm text-muted-foreground">
              Select a template from the list to preview it here
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplatePreview;