// RecipientManager.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, UserPlus } from "lucide-react";
import type { Recipient, User } from "./types";

type Props = {
  allUsers: User[];
  selectedTemplateId: string | null;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  searchResults: User[];
  selectedRecipient: User | null;
  setSelectedRecipient: (u: User | null) => void;
  recipients: Recipient[];
  setRecipients: (r: Recipient[]) => void;
};

const RecipientManager: React.FC<Props> = ({
  allUsers,
  selectedTemplateId,
  searchTerm,
  setSearchTerm,
  searchResults,
  selectedRecipient,
  setSelectedRecipient,
  recipients,
  setRecipients,
}) => {
  return (
    <div className="mb-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Add Signers</h2>

      {/* Search */}
      <div className="relative mb-4">
        <div className="flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              selectedTemplateId
                ? "Search users by email"
                : "Select a template first"
            }
            disabled={!selectedTemplateId}
          />
        </div>

        {/* Results */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  className="w-full px-4 py-2 bg-background cursor-pointer flex items-center text-left"
                  onClick={() => {
                    setSelectedRecipient(user);
                    setSearchTerm("");
                  }}
                >
                  <img
                    src={
                      user.imageUrl ||
                      "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                    }
                    alt={user.email}
                    className="h-8 w-8 rounded-full mr-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-secondary-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty */}
        {searchTerm.length > 2 &&
          searchResults.length === 0 &&
          selectedTemplateId && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
              No users found matching "{searchTerm}"
            </div>
          )}
      </div>

      {/* Selected (staging) */}
      <AnimatePresence>
        {selectedRecipient && (
          <motion.div
            className="mb-4 p-3 bg-blue-50 rounded-md flex items-center justify-between"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <div className="flex items-center min-w-0">
              <img
                src={
                  selectedRecipient.imageUrl ||
                  "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                }
                alt={selectedRecipient.email}
                className="h-10 w-10 rounded-full mr-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
                }}
              />
              <div className="min-w-0">
                <p className="font-medium text-gray-700 truncate">
                  {selectedRecipient.firstName} {selectedRecipient.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {selectedRecipient.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedRecipient(null);
              }}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Remove selected recipient"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Added Recipients */}
      {recipients.length > 0 && (
        <div className="mt-4 ">
          <h3 className="font-medium mb-2">Signers ({recipients.length})</h3>
          <div className="space-y-2">
            {recipients.map((r, index) => {
              const user = allUsers.find((u) => u.id === r.userId);
              return (
                <motion.div
                  key={`${r.userId}-${index}`}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <div className="flex items-center min-w-0">
                    <UserPlus className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium truncate">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-sm text-gray-500 ml-2 truncate">
                      ({user?.email})
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2 shrink-0">
                      {r.signaturePositions.length} signature
                      {r.signaturePositions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const next = [...recipients];
                      next.splice(index, 1);
                      setRecipients(next);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Remove recipient"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientManager;
