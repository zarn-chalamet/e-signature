import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "../AdminDashboard/Alert";
import { useQueryClient } from "@tanstack/react-query";
import type { allReceivedRequests } from "@/apiEndpoints/Signature"; // Adjust import path as needed
 // Adjust import path as needed

interface ApprovedTableProps {
  requests: allReceivedRequests | undefined | null;
}

export function ApprovedTable({ requests }: ApprovedTableProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Filter only approved requests
  const approvedRequests = requests?.allRequests?.filter(
    request => request.status === "Approved"
  ) || [];

  const handleDownloadClick = (requestId: string) => {
    setSelectedRequest(requestId);
    setAlertOpen(true);
  };

  const handleConfirmDownload = () => {
    if (selectedRequest) {
      const request = approvedRequests.find(req => req.id === selectedRequest);
      if (request && request.pdfVersions.length > 0) {
        // Get the last pdfVersion
        const lastVersion = request.pdfVersions[request.pdfVersions.length - 1];
        // Create download link
        const link = document.createElement('a');
        link.href = lastVersion.fileUrl;
        link.download = `${request.title}_v${lastVersion.version}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    setAlertOpen(false);
    setSelectedRequest(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLastPdfVersionUrl = (pdfVersions: any[]) => {
    if (pdfVersions.length === 0) return null;
    return pdfVersions[pdfVersions.length - 1].fileUrl;
  };

  if (!requests || approvedRequests.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center">
        <p className="text-gray-500">No approved requests available</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Sender ID</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.title}
                </TableCell>
                <TableCell>{request.senderId}</TableCell>
                <TableCell>
                  {request.recipients.length} recipient(s)
                </TableCell>
                <TableCell>{formatDate(request.createdAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant={request.status === "Approved" ? "default" : "secondary"}
                    className={request.status === "Approved" ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadClick(request.id)}
                      disabled={request.pdfVersions.length === 0}
                    >
                      Download
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Alert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Download Document"
        description="Are you sure you want to download this document?"
        onConfirm={handleConfirmDownload}
        confirmText="Download"
      />
    </>
  );
}