import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditFieldModalProps {
  isOpen: boolean;
  field: any;
  onClose: () => void;
  onSave: (fieldId: string, fieldName: string, fieldValue: string) => void;
  isLoading?: boolean;
}

export default function EditFieldModal({
  isOpen,
  field,
  onClose,
  onSave,
  isLoading = false,
}: EditFieldModalProps) {
  const [fieldName, setFieldName] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  useEffect(() => {
    if (field) {
      setFieldName(field.fieldName || "");
      setFieldValue(field.fieldValue || "");
    }
  }, [field, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fieldName.trim() && fieldValue.trim()) {
      onSave(field._id, fieldName, fieldValue);
      setFieldName("");
      setFieldValue("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Field</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field Name
            </label>
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="e.g., First Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field Value
            </label>
            <textarea
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              disabled={isLoading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="e.g., John Doe"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !fieldName.trim() || !fieldValue.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
