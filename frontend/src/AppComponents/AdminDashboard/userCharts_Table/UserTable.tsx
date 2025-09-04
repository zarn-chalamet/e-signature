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
import { Alert } from "../Alert";
import { deleteUser, toggleRestrict, type allUsersInfo } from "@/apiEndpoints/Users";
import { useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUrl: string | null;
  createdAt: string;
  recentTemplates: any | null;
  restricted: boolean;
}

interface UserTableProps {
  users: allUsersInfo[] | undefined | null;
}

export function UserTable({ users }: UserTableProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    type: "restrict" | "delete";
    user: User;
  } | null>(null);
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["allUsers"] });

  const handleActionClick = (type: "restrict" | "delete", user: User) => {
    setSelectedAction({ type, user });
    setAlertOpen(true);
  };

  const handleConfirmAction = async () => {
    if (selectedAction) {
      if (selectedAction.type === "restrict") {
        // Implement restrict logic here
        const response = await toggleRestrict(selectedAction.user.id);
        console.log(`Restricting user: ${selectedAction.user.id}`);
      } else if (selectedAction.type === "delete") {
        // Implement delete logic here
        const response = await deleteUser(selectedAction.user.id);
        console.log(`Deleting user: ${selectedAction.user.id}`);
      }
    }
    setAlertOpen(false);
    setSelectedAction(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "ADMIN_ROLE" ? "default" : "secondary"
                      }
                      className={
                        user.role === "ADMIN_ROLE" ? "bg-purple-600" : ""
                      }
                    >
                      {user.role === "ADMIN_ROLE" ? "Admin" : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.restricted ? "destructive" : "default"}
                      className={user.restricted ? "" : "bg-green-600"}
                    >
                      {user.restricted ? "Restricted" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionClick("restrict", user)}
                      >
                        {user.restricted ? "Unrestrict" : "Restrict"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleActionClick("delete", user)}
                      >
                        Delete
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
        title={
          selectedAction?.type === "restrict"
            ? `Are you sure you want to ${
                selectedAction.user.restricted ? "unrestrict" : "restrict"
              } this user?`
            : "Are you sure you want to delete this user?"
        }
        description={
          selectedAction?.type === "restrict"
            ? `This will ${
                selectedAction.user.restricted ? "restore" : "block"
              } ${selectedAction.user.firstName}'s account.`
            : `This action cannot be undone. This will permanently delete ${selectedAction?.user.firstName}'s account.`
        }
        onConfirm={handleConfirmAction}
        confirmText={selectedAction?.type === "delete" ? "Delete" : "Continue"}
      />
    </>
  );
}
