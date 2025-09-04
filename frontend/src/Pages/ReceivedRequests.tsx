import {
  getReceivedRequests,
  type allReceivedRequests,
} from "@/apiEndpoints/Signature";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ReceivedRequests = () => {
  const navigate = useNavigate();
  const { data: requestsData, isLoading: requestLoading } =
    useQuery<allReceivedRequests>({
      queryKey: ["allRequests"],
      queryFn: getReceivedRequests,
    });

  if (requestLoading) {
    return <div className="p-4">Loading requests...</div>;
  }

  if (!requestsData?.allRequests || requestsData.allRequests.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Received Requests</h1>
        <p>No requests found.</p>
      </div>
    );
  }

  const handleCardClick = (id: string) => {
    navigate(`/received/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4">
      <motion.h1
        className="text-xl font-semibold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Received Requests
      </motion.h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requestsData.allRequests.map((request) => (
          <div
            key={request.id}
            className="bg-card rounded-lg shadow-md p-4 border border-border hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(request.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-medium truncate">{request.title}</h2>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  request.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : request.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {request.status}
              </span>
            </div>

            <p className="text-secondary-foreground text-sm mb-2">
              <strong>Subject:</strong> {request.emailSubject}
            </p>

            <p className="text-secondary-foreground text-sm mb-2">
              <strong>Message:</strong>{" "}
              {request.emailMessage.length > 50
                ? `${request.emailMessage.substring(0, 50)}...`
                : request.emailMessage}
            </p>

            <div className="text-gray-400 text-xs mb-3">
              <strong>Recipients:</strong> {request.recipients.length}
              {request.recipients.some((r) => r.signed) && (
                <span className="ml-2 text-green-600">
                  ({request.recipients.filter((r) => r.signed).length} signed)
                </span>
              )}
            </div>

            <div className="text-xs text-gray-400">
              Created: {formatDate(request.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedRequests;
