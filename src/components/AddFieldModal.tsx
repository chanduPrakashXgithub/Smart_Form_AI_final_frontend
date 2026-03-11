import { useState } from "react";
import { X } from "lucide-react";

interface AddFieldModalProps {
  isOpen: boolean;
  sectionType: string;
  onClose: () => void;
  onSave: (sectionType: string, fieldName: string, fieldValue: string) => void;
  isLoading?: boolean;
}

export default function AddFieldModal({
  isOpen,
  sectionType,
  onClose,
  onSave,
  isLoading = false,
}: AddFieldModalProps) {
  const [fieldName, setFieldName] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldName.trim() && fieldValue.trim()) {
      onSave(sectionType, fieldName, fieldValue);
      setFieldName("");
      setFieldValue("");
    }
  };

  const handleClose = () => {
    setFieldName("");
    setFieldValue("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add New Field</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Section:</span> {sectionType}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field Name *
            </label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="e.g., Full Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field Value *
            </label>
            <textarea
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              disabled={isLoading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !fieldName.trim() || !fieldValue.trim()}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Field"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
