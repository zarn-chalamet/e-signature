// PDFViewer.tsx
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Check, Download, Loader } from "lucide-react";
import type { Recipient, SignaturePosition, Template, User } from "./types";

// IMPORTANT: keep your existing worker path
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type Props = {
  selectedTemplate: Template;
  processedFileUrl: string | null;

  // PDF state
  numPages: number;
  setNumPages: (n: number) => void;
  currentPage: number;
  setCurrentPage: (n: number) => void;
  pdfScale: number;
  setPdfScale: (n: number) => void;
  pdfLoading: boolean;
  setPdfLoading: (b: boolean) => void;
  pdfError: string | null;
  setPdfError: (s: string | null) => void;

  // Signature placement
  selectedRecipient: User | null;
  isAddingSignature: boolean;
  setIsAddingSignature: (b: boolean) => void;
  signaturePositions: SignaturePosition[];
  setSignaturePositions: (p: SignaturePosition[]) => void;

  // Applying
  recipients: Recipient[];
  setRecipients: (r: Recipient[]) => void;
  setSelectedRecipient: (u: User | null) => void;
  resetSearch: () => void; // clears searchTerm + results upstream
};

const PDFViewer: React.FC<Props> = ({
  selectedTemplate,
  processedFileUrl,
  numPages,
  setNumPages,
  currentPage,
  setCurrentPage,
  pdfScale,
  setPdfScale,
  pdfLoading,
  setPdfLoading,
  pdfError,
  setPdfError,
  selectedRecipient,
  isAddingSignature,
  setIsAddingSignature,
  signaturePositions,
  setSignaturePositions,
  recipients,
  setRecipients,
  setSelectedRecipient,
  resetSearch,
}) => {
  const [internalLoaded, setInternalLoaded] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
    setInternalLoaded(true);
    setCurrentPage(1);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setPdfLoading(false);
    setPdfError(
      "Failed to load PDF. Please check if the file exists and is accessible."
    );
  };

  const handleAddSignature = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    page: number
  ) => {
    if (!isAddingSignature || !selectedRecipient) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSignaturePositions([
      ...signaturePositions,
      { page, x, y } as SignaturePosition,
    ]);
  };

  const handleApplySignature = () => {
    if (!selectedRecipient || signaturePositions.length === 0) return;
    const newRecipient: Recipient = {
      userId: selectedRecipient.id,
      signed: false,
      signaturePositions: [...signaturePositions],
    };
    setRecipients([...recipients, newRecipient]);
    // reset staging/placement
    setSelectedRecipient(null);
    setSignaturePositions([]);
    setIsAddingSignature(false);
    resetSearch();
  };

  return (
    <div className="border rounded-md p-4 mb-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="font-medium truncate">{selectedTemplate.title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1 || pdfLoading}
            className="px-2 py-1 bg-secondary rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {numPages || "-"}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
            disabled={currentPage >= numPages || pdfLoading}
            className="px-2 py-1 bg-secondary rounded disabled:opacity-50"
          >
            Next
          </button>

          <div className="mx-2 h-5 w-px bg-gray-200" />

          <button
            onClick={() => setPdfScale(Math.max(0.5, +(pdfScale - 0.1).toFixed(2)))}
            className="px-2 py-1 bg-gray-100 rounded text-gray-800"
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="text-sm w-10 text-center">{Math.round(pdfScale * 100)}%</span>
          <button
            onClick={() => setPdfScale(Math.min(2, +(pdfScale + 0.1).toFixed(2)))}
            className="px-2 py-1 bg-gray-100 rounded text-gray-800"
            aria-label="Zoom in"
          >
            +
          </button>

          <a
            href={processedFileUrl || ""}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 flex items-center"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </a>
        </div>
      </div>

      {/* Canvas */}
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
            <p className="text-center max-w-sm">{pdfError}</p>
            <p className="text-sm text-gray-500 mt-2">
              File URL: {selectedTemplate.fileUrl}
            </p>
            {/* Retry button is handled by reselecting template upstream if needed */}
          </div>
        )}

        {!pdfLoading && !pdfError && processedFileUrl && (
          <div
            className="relative"
            onClick={(e) => handleAddSignature(e, currentPage)}
            style={{
              cursor: isAddingSignature ? "crosshair" : "default",
            }}
          >
            <Document
              file={processedFileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center h-64">
                  <Loader className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={pdfScale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>

            {/* Markers */}
            <AnimatePresence>
              {signaturePositions
                .filter((pos) => pos.page === currentPage)
                .map((pos, index) => (
                  <motion.div
                    key={`${pos.page}-${pos.x}-${pos.y}-${index}`}
                    className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"
                    style={{
                      left: `${pos.x}px`,
                      top: `${pos.y}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 15 }}
                  />
                ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Signature Controls */}
      {selectedRecipient && !pdfError && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingSignature(!isAddingSignature)}
              className={`px-3 py-2 rounded-md ${
                isAddingSignature ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              }`}
              disabled={pdfLoading}
            >
              {isAddingSignature ? "Cancel Placement" : "Add Signature"}
            </button>
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
  );
};

export default PDFViewer;
