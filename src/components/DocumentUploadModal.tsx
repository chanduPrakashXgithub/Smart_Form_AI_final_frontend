import { useState } from "react";
import { documentService } from "../services/api";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadModalProps {
  onClose: () => void;
}

export default function DocumentUploadModal({
  onClose,
}: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const documentTypes = [
    { value: "AADHAAR", label: "Aadhaar Card" },
    { value: "PAN", label: "PAN Card" },
    { value: "PASSPORT", label: "Passport" },
    { value: "TENTH", label: "10th Marksheet" },
    { value: "INTER", label: "Intermediate Certificate" },
    { value: "DEGREE", label: "Degree Certificate" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !documentType) {
      toast.error("Please select document type and file");
      return;
    }

    setLoading(true);
    try {
      const response = await documentService.uploadDocument(file, documentType);
      toast.success("Document uploaded successfully");

      // Process document
      await documentService.processDocument(response.document.id);
      toast.success("Document processed successfully");

      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Upload Document</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col h-full">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col flex-grow"
          >
            {/* Document Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Document Type*
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select document type</option>
                {documentTypes.map((dt) => (
                  <option key={dt.value} value={dt.value}>
                    {dt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload / Preview Area */}
            <div className="flex-grow">
              <label className="block text-sm font-medium mb-2">
                Upload Image*
              </label>
              {!preview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                    required
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 text-sm">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </label>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 flex flex-col items-center justify-center"
                  style={{ minHeight: "300px", maxHeight: "400px" }}
                >
                  <div
                    style={{ overflowY: "auto" }}
                    className="w-full flex items-center justify-center"
                  >
                    <img
                      src={preview}
                      alt="Document preview"
                      className="max-h-80 max-w-full rounded object-contain"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input-2"
                    />
                    <label
                      htmlFor="file-input-2"
                      className="text-xs text-blue-600 hover:underline cursor-pointer"
                    >
                      Click to change image
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* File Info */}
            {file && (
              <div className="bg-slate-50 p-3 rounded text-sm">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !file || !documentType}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload & Process"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
