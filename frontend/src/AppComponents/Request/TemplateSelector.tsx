// TemplateSelector.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Search, Shield, Users } from "lucide-react";
import type { Template } from "./types";
import CreateTemplate from "../Template/CreateTemplate";
import { Button } from "@/components/ui/button";

type Props = {
  templates: Template[];
  activeTab: "public" | "private";
  setActiveTab: (t: "public" | "private") => void;
  selectedTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
};

const TemplateSelector: React.FC<Props> = ({
  templates,
  activeTab,
  setActiveTab,
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <motion.div
      className="bg-card rounded-xl shadow-lg border border-border p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Select a Template</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6">
        <button
          className={`flex items-center justify-center py-2 px-4 font-medium rounded-md transition-all flex-1 ${
            activeTab === "public"
              ? "bg-indigo-400 dark:bg-indigo-900 shadow-sm text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("public")}
        >
          <Users className="h-4 w-4 mr-2" />
          Public Templates
        </button>
        <button
          className={`flex items-center justify-center py-2 px-4 font-medium rounded-md transition-all flex-1 ${
            activeTab === "private"
              ? "bg-indigo-400 dark:bg-indigo-900 shadow-sm text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("private")}
        >
          <Shield className="h-4 w-4 mr-2" />
          My Templates
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {Array.isArray(templates) && templates.length > 0 ? (
            templates.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  onClick={() => onSelectTemplate(t)}
                  className={`group text-left border rounded-xl p-4 cursor-pointer transition-all w-full h-full ${
                    selectedTemplate?.id === t.id
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md"
                      : "border-border hover:border-emerald-300 hover:shadow-md bg-background"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start mb-3">
                    <div
                      className={`p-2 rounded-lg mr-3 ${
                        selectedTemplate?.id === t.id
                          ? "bg-emerald-100 dark:bg-emerald-900/30"
                          : "bg-muted"
                      }`}
                    >
                      <FileText
                        className={`h-5 w-5 ${
                          selectedTemplate?.id === t.id
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <h3 className="font-semibold text-foreground truncate group-hover:text-emerald-600 transition-colors">
                      {t.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Uploaded: {new Date(t.uploadedAt).toLocaleDateString()}
                  </p>
                </motion.button>
              </motion.div>
            ))
          ) : (
            <>
              <motion.div
                className="col-span-2 text-center py-12 px-4 rounded-xl border border-dashed border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground font-medium">
                  No {activeTab} templates available
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a new template or check back later
                </p>
                <div className="py-2">
                <CreateTemplate trigger={
                  <Button variant={"outline"}>Create new Template <Plus/> </Button>
                } />
              </div>
              </motion.div>
              
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TemplateSelector;
