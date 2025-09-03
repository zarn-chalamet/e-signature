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
import { Switch } from "@/components/ui/switch";
// import { AlertDialogDemo } from "./AlertDialogDemo";
import { Alert } from "../Alert";

interface Template {
  id: string;
  uploaderId: string;
  title: string;
  uploadedAt: string;
  fileUrl: string;
  frequency: number | null;
  public: boolean;
}

interface TemplateTableProps {
  templates: Template[];
}

export function TemplateTable({ templates }: TemplateTableProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    type: "toggle" | "delete";
    template: Template;
  } | null>(null);
  const [localTemplates, setLocalTemplates] = useState<Template[]>(templates);

  const handleTogglePublic = (templateId: string) => {
    setLocalTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, public: !template.public }
          : template
      )
    );

    // API call to update template visibility would go here
    console.log(`Toggled visibility for template: ${templateId}`);
  };

  const handleActionClick = (type: "toggle" | "delete", template: Template) => {
    if (type === "delete") {
      setSelectedAction({ type, template });
      setAlertOpen(true);
    } else {
      // For toggle, we don't need confirmation
      handleTogglePublic(template.id);
    }
  };

  const handleConfirmAction = () => {
    if (selectedAction && selectedAction.type === "delete") {
      // Implement delete logic here
      setLocalTemplates((prev) =>
        prev.filter((template) => template.id !== selectedAction.template.id)
      );
      console.log(`Deleting template: ${selectedAction.template.id}`);
    }
    setAlertOpen(false);
    setSelectedAction(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileNameFromPath = (filePath: string) => {
    return filePath.split("\\").pop() || filePath;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {/* <TableHead>File</TableHead> */}
              <TableHead>Uploaded At</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localTemplates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.title}</TableCell>
                {/* <TableCell>{getFileNameFromPath(template.fileUrl)}</TableCell> */}
                <TableCell>{formatDate(template.uploadedAt)}</TableCell>
                <TableCell>
                  {template.frequency !== null ? template.frequency : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={template.public ? "default" : "secondary"}
                    className={template.public ? "bg-green-600" : "bg-gray-600"}
                  >
                    {template.public ? "Public" : "Private"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Public</span>
                      <Switch
                        checked={template.public}
                        onCheckedChange={() =>
                          handleActionClick("toggle", template)
                        }
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleActionClick("delete", template)}
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
        title="Are you sure you want to delete this template?"
        description="This action cannot be undone. This will permanently delete the template."
        onConfirm={handleConfirmAction}
        confirmText="Delete"
      />
    </>
  );
}
