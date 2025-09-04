import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Document, Page, pdfjs } from "react-pdf";
import SignaturePad from "react-signature-canvas";
import { PDFDocument, rgb } from "pdf-lib";
import {
  getRequestById,
  downloadTemplatePdf,
  downloadRequestPdf,
  signDocument,
  type receivedRequest,
} from "@/apiEndpoints/Signature";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  ArrowLeft,
  Download,
  FileText,
  PenTool,
  RotateCcw,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const SigningPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const signaturePadRef = useRef<SignaturePad>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [signedPdfBlob, setSignedPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isSignatureApplied, setIsSignatureApplied] = useState(false);
  const [pdfScale, setPdfScale] = useState<number>(1); // Track the scale used for display

  const user = useSelector((state: any) => state.user);

  // Fetch request data
  const {
    data: request,
    isLoading,
    error,
  } = useQuery<receivedRequest>({
    queryKey: ["request", id],
    queryFn: () => getRequestById(id!),
    enabled: !!id,
  });

  // Download PDF mutation
  const downloadPdfMutation = useMutation({
    mutationFn: async () => {
      if (!request) throw new Error("No request data");

      let blob;
      if (request.pdfVersions && request.pdfVersions.length > 0) {
        blob = await downloadRequestPdf(request.id);
      } else {
        blob = await downloadTemplatePdf(request.templateId);
      }
      return blob;
    },
    onSuccess: (blob) => {
      setPdfBlob(blob);
      setSignedPdfBlob(null);
    },
    onError: (error: any) => {
      alert(`Error downloading PDF: ${error.message}`);
    },
  });

  // Sign document mutation
  const signMutation = useMutation({
    mutationFn: async (file: File) => {
      return await signDocument(id!, file);
    },
    onSuccess: () => {
      alert("Document signed successfully!");
      navigate("/received");
    },
    onError: (error: any) => {
      alert(`Error signing document: ${error.message}`);
    },
  });

  const handleDownloadPdf = () => {
    downloadPdfMutation.mutate();
  };

  const handleSignDocument = () => {
    setShowSignaturePad(true);
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setSignature(null);
    }
  };

  const saveSignature = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const signatureDataUrl = signaturePadRef.current.toDataURL();
      setSignature(signatureDataUrl);
      setShowSignaturePad(false);
    }
  };

  const applySignatureToPdf = async () => {
    if (!signature || !pdfBlob || !request) return;

    try {
      // Convert signature data URL to image data
      const signatureResponse = await fetch(signature);
      const signatureArrayBuffer = await signatureResponse.arrayBuffer();

      // Load the PDF document
      const pdfArrayBuffer = await pdfBlob.arrayBuffer();
      const pdfDoc = await PDFDocument.load(new Uint8Array(pdfArrayBuffer));

      // Get the signature positions for the current user
      const currentUserId = user.userId;
      const currentUserRecipient = request.recipients.find(
        (recipient) => recipient.userId === currentUserId
      );

      if (!currentUserRecipient) {
        throw new Error("No signature positions found for current user");
      }

      // Embed the signature image
      const signatureImage = await pdfDoc.embedPng(
        new Uint8Array(signatureArrayBuffer)
      );

      // Calculate signature dimensions
      const signatureWidth = 120;
      const signatureHeight = 60;

      // Get the display dimensions used by react-pdf
      const displayWidth = Math.min(600, window.innerWidth - 64);

      // Add signature to each specified page and position
      for (const position of currentUserRecipient.signaturePositions) {
        const pageIndex = position.page - 1;
        if (pageIndex >= pdfDoc.getPages().length) {
          console.warn(`Page ${position.page} not found in PDF`);
          continue;
        }

        const page = pdfDoc.getPages()[pageIndex];
        const { width: pageWidth, height: pageHeight } = page.getSize();

        // Calculate the scale factor used by react-pdf for display
        const displayScale = displayWidth / pageWidth;

        // Calculate the display height based on the scale
        const displayHeight = pageHeight * displayScale;

        // Convert from viewer coordinates (top-left origin) to PDF coordinates (bottom-left origin)
        // 1. Scale the coordinates back to PDF dimensions
        const pdfX = position.x / displayScale;

        // 2. Flip the Y coordinate: viewer Y starts from top, PDF Y starts from bottom
        //    Also account for the fact that the signature position was clicked in the displayed PDF
        const pdfY = pageHeight - position.y / displayScale;

        // Center the signature on the click point
        const finalX = Math.max(
          0,
          Math.min(pageWidth - signatureWidth, pdfX - signatureWidth / 2)
        );
        const finalY = Math.max(
          0,
          Math.min(pageHeight - signatureHeight, pdfY - signatureHeight / 2)
        );

        console.log(
          `Placing signature at PDF coordinates: x=${finalX}, y=${finalY}`
        );
        console.log(
          `Calculated PDF coords before centering: x=${pdfX}, y=${pdfY}`
        );
        console.log(`Original position: x=${position.x}, y=${position.y}`);
        console.log(`Page dimensions: ${pageWidth}x${pageHeight}`);
        console.log(
          `Display scale: ${displayScale}, Display dimensions: ${displayWidth}x${displayHeight}`
        );

        // Ensure coordinates are within page bounds
        if (
          finalX >= 0 &&
          finalY >= 0 &&
          finalX + signatureWidth <= pageWidth &&
          finalY + signatureHeight <= pageHeight
        ) {
          page.drawImage(signatureImage, {
            x: finalX,
            y: finalY,
            width: signatureWidth,
            height: signatureHeight,
          });
          console.log(`Signature successfully placed`);
        } else {
          console.warn(
            `Signature coordinates out of bounds, placing at safe position`
          );
          // Fallback: place signature at a safe position
          page.drawImage(signatureImage, {
            x: 50,
            y: 50,
            width: signatureWidth,
            height: signatureHeight,
          });
        }
      }

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob(
        [modifiedPdfBytes as unknown as BlobPart],
        {
          type: "application/pdf",
        }
      );

      setSignedPdfBlob(modifiedPdfBlob);
      setIsSignatureApplied(true);
    } catch (error) {
      console.error("Error applying signature:", error);
      alert("Error applying signature to document");
    }
  };

  const completeSigning = async () => {
    if (!signedPdfBlob || !isSignatureApplied) {
      alert("Please sign and apply your signature first");
      return;
    }

    const signedFile = new File(
      [signedPdfBlob],
      `signed-${request?.title}.pdf`,
      {
        type: "application/pdf",
      }
    );

    signMutation.mutate(signedFile);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {(error as Error).message}
            </p>
            <Button onClick={() => navigate("/received")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Document Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/received")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayBlob = signedPdfBlob || pdfBlob;
  const blobUrl = displayBlob ? URL.createObjectURL(displayBlob) : null;

  return (
    <div className="min-h-screen py-8 px-4 mb-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => navigate("/received")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
          </Button>

          <Card className="mb-6 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                {request.title}
              </CardTitle>
              <CardDescription>
                Please review and sign this document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    Subject
                  </p>
                  <p className="mb-3">{request.emailSubject}</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground">
                    Message
                  </p>
                  <p className="mb-3">{request.emailMessage}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-4 flex-wrap">
                <Button
                  onClick={handleDownloadPdf}
                  disabled={downloadPdfMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {downloadPdfMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Document
                    </>
                  )}
                </Button>

                {pdfBlob && !showSignaturePad && !signature && (
                  <Button
                    onClick={handleSignDocument}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <PenTool className="h-4 w-4" />
                    Sign Document
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {showSignaturePad && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-blue-600" />
                    Sign Here
                  </CardTitle>
                  <CardDescription>
                    Draw your signature in the box below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg mb-4 bg-white p-2">
                    <SignaturePad
                      ref={signaturePadRef}
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className:
                          "signature-canvas w-full bg-white rounded-md",
                      }}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={saveSignature}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Save Signature
                    </Button>
                    <Button
                      onClick={clearSignature}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Clear
                    </Button>
                    <Button
                      onClick={() => setShowSignaturePad(false)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {signature && !isSignatureApplied && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle>Your Signature</CardTitle>
                  <CardDescription>
                    Review your signature before applying it to the document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="border rounded-lg p-4 bg-white">
                      <img
                        src={signature}
                        alt="Signature"
                        className="max-w-xs mx-auto"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button
                        onClick={applySignatureToPdf}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Apply Signature to Document
                      </Button>
                      <Button
                        onClick={() => {
                          setSignature(null);
                          setShowSignaturePad(true);
                        }}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <PenTool className="h-4 w-4" />
                        Draw Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {blobUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle>Document Preview</CardTitle>
                <CardDescription>
                  Page {currentPage} of {numPages}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 flex justify-center">
                  <Document
                    file={blobUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex justify-center items-center h-96">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading document...</p>
                        </div>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={currentPage}
                      width={Math.min(600, window.innerWidth - 64)}
                      loading={
                        <div className="flex justify-center items-center h-96">
                          <div className="text-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading page...</p>
                          </div>
                        </div>
                      }
                    />
                  </Document>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage <= 1}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {numPages}
                    </span>
                  </div>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, numPages))
                    }
                    disabled={currentPage >= numPages}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-4 flex-wrap"
        >
          <Button
            onClick={completeSigning}
            disabled={!isSignatureApplied || signMutation.isPending}
            size="lg"
            className="flex items-center gap-2"
          >
            {signMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Complete Signing
              </>
            )}
          </Button>

          {isSignatureApplied && (
            <Button
              onClick={() => {
                setIsSignatureApplied(false);
                setSignedPdfBlob(null);
              }}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Revert Signature
            </Button>
          )}
        </motion.div>

        <AnimatePresence>
          {signature && isSignatureApplied && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  Signature applied to document. Ready to complete signing.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SigningPage;
