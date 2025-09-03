import React from 'react';
import { Search } from 'lucide-react';
import type { User } from './types';

interface RecipientSearchProps {
  searchTerm: string;
  searchResults: User[];
  selectedTemplate: any;
  onSearchChange: (term: string) => void;
  onSelectRecipient: (user: User) => void;
}

const RecipientSearch: React.FC<RecipientSearchProps> = ({
  searchTerm,
  searchResults,
  selectedTemplate,
  onSearchChange,
  onSelectRecipient,
}) => {
  return (
    <div className="relative mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder={selectedTemplate ? "Search users by email" : "Select a template first"}
          disabled={!selectedTemplate}
        />
      </div>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center transition-colors duration-150"
              onClick={() => onSelectRecipient(user)}
            >
              <img
                src={user.imageUrl || '/default-avatar.png'}
                alt={user.email}
                className="h-10 w-10 rounded-full mr-3 border-2 border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-avatar.png';
                }}
              />
              <div>
                <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {searchTerm.length > 2 && searchResults.length === 0 && selectedTemplate && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No users found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default RecipientSearch;