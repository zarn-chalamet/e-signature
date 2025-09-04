// Request.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import TemplateSelector from "@/AppComponents/Request/TemplateSelector";
import RecipientManager from "@/AppComponents/Request/RecipientManager";
import PDFViewer from "@/AppComponents/Request/PDFViewer";
import { createRequest } from "@/apiEndpoints/Signature";
import type {
  Recipient,
  SignaturePosition,
  Template,
  User,
} from "@/AppComponents/Request/types";
import { Loader } from "lucide-react";

const Request: React.FC = () => {
  // Redux data
  const allUsers = useSelector(
    (state: any) => state.allUsers.allUsers
  ) as User[];
  const publicTemplates = useSelector(
    (state: any) => state.publicTemplates.publicTemplates
  ) as Template[];
  const privateTemplates = useSelector(
    (state: any) => state.privateTemplates
  ) as Template[];

  // Tabs & templates
  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const templates = activeTab === "public" ? publicTemplates : privateTemplates;

  // Selected template + processed URL
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recipient flow
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [signaturePositions, setSignaturePositions] = useState<
    SignaturePosition[]
  >([]);
  const [isAddingSignature, setIsAddingSignature] = useState(false);

  // PDF UI state
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfScale, setPdfScale] = useState(1.3);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // ===== Template select handler (keeps your original URL-fix logic) =====
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPdfError(null);
    setPdfLoading(false);

    let fileUrl = template.fileUrl;

    // Convert local path to API file URL
    if (fileUrl.startsWith("/Users/") || fileUrl.startsWith("C:\\")) {
      const filename = fileUrl.split("/").pop() || fileUrl.split("\\").pop();
      fileUrl = `/api/files/${filename}`;
      console.warn(`Converting local file path to server URL: ${fileUrl}`);
    }

    const backendUrl = import.meta.env?.VITE_API_URL || "http://localhost:8080";

    if (fileUrl.startsWith("/api/")) {
      fileUrl = `${backendUrl}${fileUrl}`;
    } else if (!fileUrl.startsWith("http")) {
      fileUrl = `${backendUrl}/api/files/${fileUrl}`;
    }

    setProcessedFileUrl(fileUrl);
    setSelectedTemplate({ ...template, fileUrl });
  };

  // ===== Search effect (unchanged logic, only when template is selected) =====
  useEffect(() => {
    if (searchTerm.length > 2 && Array.isArray(allUsers) && selectedTemplate) {
      const results = allUsers.filter(
        (user: User) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !recipients.some((r) => r.userId === user.id)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allUsers, selectedTemplate, recipients]);

  // Clear search when template deselected
  useEffect(() => {
    if (!selectedTemplate) {
      setSearchTerm("");
      setSearchResults([]);
      setSelectedRecipient(null);
      setSignaturePositions([]);
      setProcessedFileUrl(null);
      setCurrentPage(1);
      setNumPages(0);
    }
  }, [selectedTemplate]);

  const resetSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  // ===== Submit handler (your logic preserved) =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate || recipients.length === 0) {
      alert("Please select a template and add at least one recipient");
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

      if ("message" in result) {
        alert(`Error: ${result.message}`);
      } else {
        alert("Request created successfully!");
        // reset
        setSelectedTemplate(null);
        setRecipients([]);
        setTitle("");
        setEmailSubject("");
        setEmailMessage("");
        resetSearch();
        setSelectedRecipient(null);
        setSignaturePositions([]);
        setProcessedFileUrl(null);
      }
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Error creating request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-2xl font-semibold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Signature Request
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          {/* Left: Template Selection */}
          <TemplateSelector
            templates={templates || []}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleTemplateSelect}
          />

          {/* Right: PDF + Recipients + Form */}
          <motion.div
            className="bg-card rounded-lg shadow p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {selectedTemplate ? (
              <>
                {/* Request form fields */}
                <motion.div
                  className="mt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Request Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-foreground mb-1">
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
                      <label className="block text-sm font-medium text-secondary-foreground mb-1">
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
                      <label className="block text-sm font-medium text-secondary-foreground mb-1">
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

                {/* Recipient Manager */}
                <RecipientManager
                  allUsers={allUsers || []}
                  selectedTemplateId={selectedTemplate?.id ?? null}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchResults={searchResults}
                  selectedRecipient={selectedRecipient}
                  setSelectedRecipient={setSelectedRecipient}
                  recipients={recipients}
                  setRecipients={setRecipients}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <p className="text-lg font-medium">
                  Select a template to get started
                </p>
                <p className="text-sm mt-2 text-center max-w-sm">
                  Choose a public or private template from the left panel to
                  begin adding signers
                </p>
              </div>
            )}
          </motion.div>
        </div>
        {selectedTemplate && (
          <>
            {/* PDF Viewer & placement */}
            <PDFViewer
              selectedTemplate={selectedTemplate}
              processedFileUrl={processedFileUrl}
              // pdf state
              numPages={numPages}
              setNumPages={setNumPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pdfScale={pdfScale}
              setPdfScale={setPdfScale}
              pdfLoading={pdfLoading}
              setPdfLoading={setPdfLoading}
              pdfError={pdfError}
              setPdfError={setPdfError}
              // placement state
              selectedRecipient={selectedRecipient}
              isAddingSignature={isAddingSignature}
              setIsAddingSignature={setIsAddingSignature}
              signaturePositions={signaturePositions}
              setSignaturePositions={setSignaturePositions}
              // apply flow
              recipients={recipients}
              setRecipients={setRecipients}
              setSelectedRecipient={setSelectedRecipient}
              resetSearch={resetSearch}
            />

            {/* Submit */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={
                  recipients.length === 0 ||
                  isSubmitting ||
                  !title ||
                  !emailSubject ||
                  !emailMessage
                }
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Sending Request...
                  </>
                ) : (
                  "Send Signature Request"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Request;
