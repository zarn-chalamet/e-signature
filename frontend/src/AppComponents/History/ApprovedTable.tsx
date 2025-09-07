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
import type { allReceivedRequests } from "@/apiEndpoints/Signature";

interface ApprovedTableProps {
  requests: allReceivedRequests | undefined | null;
  toggleApprovedRequests: boolean; // true = all requests, false = only approved
}

export function ApprovedTable({
  requests,
  toggleApprovedRequests,
}: ApprovedTableProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Decide which requests to show
  const displayedRequests =
    requests?.allRequests?.filter((request) =>
      toggleApprovedRequests ? true : request.status === "Approved"
    ) || [];

  const handleDownloadClick = (requestId: string) => {
    setSelectedRequest(requestId);
    setAlertOpen(true);
  };

  const handleConfirmDownload = () => {
    if (selectedRequest) {
      const request = displayedRequests.find((req) => req.id === selectedRequest);
      if (request && request.pdfVersions && request.pdfVersions.length > 0) {
        const lastVersion =
          request.pdfVersions[request.pdfVersions.length - 1];
        if (lastVersion?.fileUrl) {
          const link = document.createElement("a");
          link.href = lastVersion.fileUrl;
          link.download = `${request.title}_v${lastVersion.version}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
    setAlertOpen(false);
    setSelectedRequest(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!requests || displayedRequests.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center">
        <p className="text-gray-500">
          {toggleApprovedRequests
            ? "No requests available"
            : "No approved requests available"}
        </p>
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
            {displayedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.title}</TableCell>
                <TableCell>{request.senderId}</TableCell>
                <TableCell>
                  {request.recipients
                    ? `${request.recipients.length} recipient(s)`
                    : "No recipients"}
                </TableCell>
                <TableCell>{formatDate(request.createdAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === "Approved" ? "default" : "secondary"
                    }
                    className={
                      request.status === "Approved"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }
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
                      disabled={
                        !request.pdfVersions ||
                        request.pdfVersions.length === 0
                      }
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
