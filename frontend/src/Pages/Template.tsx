// First, let's update your main Template.tsx component:
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  getUserTemplates,
  getPublicTemplates,
  type privateTemplates,
  type publicTemplates,
  type template,
} from "@/apiEndpoints/Templates";
import TemplateSelector from "@/AppComponents/Request/TemplateSelector";
import TemplatePreview from "@/AppComponents/Template/TemplatePreview";
import { useQuery } from "@tanstack/react-query";
import CreateTemplate from "@/AppComponents/Template/CreateTemplate";
import { Plus } from "lucide-react";

const Template = () => {
  const {
    data: publicTemplatesData,
    isLoading: templatesLoading,
    error: templatesError,
  } = useQuery<publicTemplates>({
    queryKey: ["publicTemplates"],
    queryFn: getPublicTemplates,
  });

  const {
    data: privateTemplatesData,
    isLoading: privateTemplatesLoading,
    error: privateTemplatesError,
  } = useQuery<privateTemplates>({
    queryKey: ["privateTemplates"],
    queryFn: getUserTemplates,
  });

  const cards = [
    {
      title: "Public Templates",
      path: "/dashboard/templates",
      count: publicTemplatesData?.publicTemplates.length || 0,
      bgColor: "bg-yellow-200",
      textColor: "text-yellow-800",
      hoverColor: "hover:bg-yellow-250",
    },
    {
      title: "User Templates",
      path: "/dashboard/templates",
      count: privateTemplatesData?.privateTemplates.length || 0,
      bgColor: "bg-green-200",
      textColor: "text-green-800",
      hoverColor: "hover:bg-green-250",
    },
  ];

  const [activeTab, setActiveTab] = useState<"public" | "private">("public");
  const [selectedTemplate, setSelectedTemplate] = useState<template | null>(
    null
  );
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);

  const templates =
    activeTab === "public"
      ? publicTemplatesData?.publicTemplates
      : privateTemplatesData?.privateTemplates;

  const handleTemplateSelect = (template: template) => {
    setSelectedTemplate(template);
    setPdfError(null);
    setPdfLoading(true);

    let fileUrl = template.fileUrl;
    setProcessedFileUrl(fileUrl);
    setSelectedTemplate({ ...template, fileUrl });
  };

  return (
    <>
      <div>
        <motion.h1
          className="text-2xl font-semibold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Templates
        </motion.h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {cards.map((item, index) => (
            <div
              key={index}
              className={`w-full h-28 ${item.bgColor} ${item.hoverColor} rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer`}
            >
              <div className="flex justify-between">
                <h2 className="text-lg text-gray-600 font-semibold">
                  {item.title}
                </h2>
                <p className={`text-xl font-bold ${item.textColor}`}>
                  {item.count}
                </p>
              </div>
            </div>
          ))}
          <CreateTemplate
          trigger={
            <div className="w-full h-28 bg-gray-150 dark:bg-stone-800 rounded-lg shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] cursor-pointer flex flex-col items-center gap-2 text-center justify-center">
              <span>Create new Template</span> <Plus />
            </div>
          }
        /> 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TemplateSelector
            templates={templates || []}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleTemplateSelect}
          />

          <TemplatePreview
            selectedTemplate={selectedTemplate}
            fileUrl={processedFileUrl}
            isLoading={pdfLoading}
            error={pdfError}
            onLoadSuccess={() => setPdfLoading(false)}
            onLoadError={(error: any) => {
              setPdfError(error.message);
              setPdfLoading(false);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Template;
