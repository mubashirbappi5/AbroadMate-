"use client";

import * as React from "react";
import {
  UploadCloud,
  FileText,
  FileCheck,
  X,
  AlertCircle,
  File as FileIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DocumentUploadProps {
  label?: string;
  hint?: string;
  accept?: string[]; // e.g. [".pdf", ".docx", ".jpg", ".png"]
  maxSizeMb?: number; // default 5 MB
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

export function DocumentUpload({
  label = "Upload Academic Documents",
  hint = "Supported formats: PDF, DOCX, JPG, PNG (Max size: 5MB per file)",
  accept = [".pdf", ".docx", ".jpg", ".jpeg", ".png"],
  maxSizeMb = 5,
  multiple = false,
  onFilesChange,
  className,
  disabled = false,
}: DocumentUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check size
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return `"${file.name}" exceeds the ${maxSizeMb}MB maximum limit.`;
    }

    // Check extension
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (accept.length > 0 && !accept.includes(extension)) {
      return `"${file.name}" has an unsupported format. Accepted: ${accept.join(", ")}`;
    }

    return null;
  };

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setErrorMessage(null);

    const validNewFiles: File[] = [];
    const fileListArray = Array.from(incomingFiles);

    for (const file of fileListArray) {
      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        return;
      }
      validNewFiles.push(file);
    }

    const updatedFiles = multiple
      ? [...files, ...validNewFiles]
      : validNewFiles.slice(0, 1);

    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updated);
    onFilesChange?.(updated);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
          isDragOver
            ? "border-brand-600 bg-brand-50/70 ring-2 ring-brand-600/20"
            : "border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-brand-500",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              isDragOver ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-500"
            )}
          >
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800">
              <span className="text-brand-700 hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">{hint}</p>
          </div>
        </div>
      </div>

      {/* Validation Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                  {file.name.endsWith(".pdf") ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <FileIcon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <FileCheck className="w-3 h-3" />
                  Ready
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(idx);
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
