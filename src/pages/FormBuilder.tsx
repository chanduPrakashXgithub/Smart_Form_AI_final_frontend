import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormBuilderEnhanced from "../components/FormBuilderEnhanced";
import {
  Eye,
  Upload,
  FileText,
  Loader2,
  Sparkles,
  X,
  Edit2,
  Check,
} from "lucide-react";
import axios from "axios";
import { API_CONFIG } from "../lib/constants";

export default function FormBuilder() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upload" | "paste" | "form">(
    "upload",
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedForm, setGeneratedForm] = useState<any[]>([]);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState<string>("Extracted Form");
  const [isEditingFormName, setIsEditingFormName] = useState(false);
  const [tempFormName, setTempFormName] = useState<string>("");

  // Default form fields (fallback)
  const defaultFormFields = [
    { label: "Full Name", type: "text", required: true },
    { label: "Date of Birth", type: "date", required: true },
    { label: "Email ID", type: "email", required: true },
    { label: "Phone Number", type: "tel", required: false },
    { label: "Gender", type: "text", required: false },
    { label: "Father's Name", type: "text", required: false },
    { label: "Mother's Name", type: "text", required: false },
    { label: "Address", type: "text", required: false },
    { label: "10th Percentage", type: "text", required: false },
    { label: "12th Percentage", type: "text", required: false },
    { label: "B.Tech CGPA", type: "text", required: false },
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleDragLeave = () => {
    setIsDraggingImage(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Extract form from image
  const handleExtractFromImage = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("❌ Authentication failed. Please login again.");
      console.error("No auth token found. Please login first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("formImage", selectedImage);

      const apiUrl = API_CONFIG.BASE_URL;

      const response = await axios.post(
        `${apiUrl}/api/forms/smart-generate-from-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const extractedFields = response.data.form?.fields || [];
      const cleanedFields = extractedFields.map((field: any) => ({
        label: field.label || field.fieldName || "Unnamed Field",
        type: field.fieldType || field.type || "text",
        required: field.required ?? false,
      }));

      // Capture the form ID and name from the response (smart-generate-from-image creates form in DB)
      const formId = response.data.form?._id;
      const extractedFormName =
        response.data.form?.formName || "Extracted Form";
      if (formId) {
        setCurrentFormId(formId);
        setFormName(extractedFormName);
        console.log(
          "✅ Form created with ID:",
          formId,
          "Name:",
          extractedFormName,
        );
      }

      setGeneratedForm(
        cleanedFields.length > 0 ? cleanedFields : defaultFormFields,
      );
      setActiveTab("form");
      setError(null);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to extract form from image";
      setError(`❌ ${errorMsg}`);

      if (err.response?.status === 401) {
        console.error("Token invalid or expired. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Extract form from text
  const handleExtractFromText = async () => {
    if (!pastedText.trim()) {
      setError("Please paste form content first");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("❌ Authentication failed. Please login again.");
      console.error("No auth token found. Please login first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = API_CONFIG.BASE_URL;

      const response = await axios.post(
        `${apiUrl}/api/forms/generate-from-text`,
        { pastedText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const extractedFields = response.data.form?.fields || [];
      const cleanedFields = extractedFields.map((field: any) => ({
        label: field.label || field.fieldName || "Unnamed Field",
        type: field.fieldType || field.type || "text",
        required: field.required ?? false,
      }));

      // Capture the form ID and name from the response (generate-from-text creates form in DB)
      const formId = response.data.form?._id;
      const extractedFormName =
        response.data.form?.formName || "Extracted Form";
      if (formId) {
        setCurrentFormId(formId);
        setFormName(extractedFormName);
        console.log(
          "✅ Form created with ID:",
          formId,
          "Name:",
          extractedFormName,
        );
      }

      setGeneratedForm(
        cleanedFields.length > 0 ? cleanedFields : defaultFormFields,
      );
      setActiveTab("form");
      setError(null);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to extract form from text";
      setError(`❌ ${errorMsg}`);

      if (err.response?.status === 401) {
        console.error("Token invalid or expired. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update form name in database
  const handleUpdateFormName = async () => {
    if (!tempFormName.trim() || !currentFormId) {
      setIsEditingFormName(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("❌ Authentication required.");
        return;
      }

      const apiUrl = API_CONFIG.BASE_URL;

      const response = await fetch(`${apiUrl}/api/forms/${currentFormId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ formName: tempFormName.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        setFormName(tempFormName.trim());
        setIsEditingFormName(false);
        console.log("✅ Form name updated:", tempFormName.trim());
      } else {
        console.error("❌ Failed to update form name:", result);
        alert(
          `❌ Failed to update form name: ${result.message || "Unknown error"}`,
        );
        setIsEditingFormName(false);
      }
    } catch (error: any) {
      console.error("❌ Error updating form name:", error);
      alert(`❌ Error: ${error.message}`);
      setIsEditingFormName(false);
    }
  };

  // Handle form submission - Save to database (with file uploads)
  const handleSubmit = async (data: any) => {
    try {
      console.log("📤 Form submit handler called with data:", data);

      // Validate we have form ID
      if (!currentFormId) {
        alert("❌ No form extracted. Please upload or paste a form first.");
        return;
      }

      // Get auth token
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("❌ Authentication required. Please login.");
        return;
      }

      const apiUrl = API_CONFIG.BASE_URL;

      // Extract files from data
      const files = data.__files || {};
      delete data.__files; // Remove files from data object

      console.log("📤 Submitting form data...", {
        formId: currentFormId,
        fields: Object.keys(data).length,
        files: Object.keys(files).length,
      });

      // Use FormData if there are files
      let response;
      if (Object.keys(files).length > 0) {
        const formData = new FormData();
        formData.append("submittedData", JSON.stringify(data));

        // Append files with their field names
        Object.entries(files).forEach(([fieldName, file]) => {
          formData.append(fieldName, file as File);
        });

        response = await fetch(`${apiUrl}/api/forms/${currentFormId}/submit`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - browser will set it with boundary for multipart/form-data
          },
          body: formData,
        });
      } else {
        // No files - use JSON
        response = await fetch(`${apiUrl}/api/forms/${currentFormId}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ submittedData: data }),
        });
      }

      const result = await response.json();

      if (response.ok) {
        console.log("✅ Form submitted successfully:", result);
        alert("✅ Form submitted and saved successfully!");
        // Reset form
        setCurrentFormId(null);
        setGeneratedForm([]);
        setActiveTab("upload");
      } else {
        console.error("❌ Backend error:", result);
        alert(`❌ Failed to submit form: ${result.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("❌ Form submission error:", error);
      alert(`❌ Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Smart Form Builder
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Create form → Auto-fill from vault
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/form-history")}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">View Submissions</span>
                <span className="sm:hidden">History</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Upload & Paste Tabs */}
        {activeTab !== "form" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 border-b border-slate-200">
              <button
                onClick={() => setActiveTab("upload")}
                className={`pb-3 px-4 flex items-center gap-2 font-medium transition ${
                  activeTab === "upload"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload Form Image
              </button>
              <button
                onClick={() => setActiveTab("paste")}
                className={`pb-3 px-4 flex items-center gap-2 font-medium transition ${
                  activeTab === "paste"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-4 h-4" />
                Paste Form Content
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-3">
                <span>⚠️</span>
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-auto">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div className="space-y-4">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
                    isDraggingImage
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 hover:border-blue-400"
                  }`}
                >
                  {!imagePreview ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="form-image-input"
                      />
                      <label
                        htmlFor="form-image-input"
                        className="cursor-pointer"
                      >
                        <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                        <p className="text-slate-700 font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          PNG, JPG, JPEG up to 10MB
                        </p>
                      </label>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Form preview"
                        className="max-h-80 mx-auto rounded-lg"
                      />
                      <div className="flex gap-2 justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="form-image-input-2"
                        />
                        <label
                          htmlFor="form-image-input-2"
                          className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer transition"
                        >
                          Change Image
                        </label>
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                          className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleExtractFromImage}
                  disabled={!selectedImage || loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting Form Fields...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Extract & Auto-Fill Form
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Paste Tab */}
            {activeTab === "paste" && (
              <div className="space-y-4">
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your form content here... (field names, separated by lines or commas)"
                  className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />

                <button
                  onClick={handleExtractFromText}
                  disabled={!pastedText.trim() || loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting Form Fields...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Extract & Auto-Fill Form
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form Display with Auto-Fill */}
        {activeTab === "form" && generatedForm.length > 0 && (
          <div>
            {/* Form Name Editor */}
            <div className="mb-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                {isEditingFormName ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={tempFormName}
                      onChange={(e) => setTempFormName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateFormName();
                        if (e.key === "Escape") setIsEditingFormName(false);
                      }}
                      className="flex-1 px-4 py-2 text-xl font-bold border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter form name"
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateFormName}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      title="Save"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsEditingFormName(false)}
                      className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-800">
                      {formName}
                    </h2>
                    <button
                      onClick={() => {
                        setTempFormName(formName);
                        setIsEditingFormName(true);
                      }}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit form name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {generatedForm.length}{" "}
                {generatedForm.length === 1 ? "field" : "fields"}
              </p>
            </div>

            <div className="mb-4 flex items-center justify-end">
              <button
                onClick={() => {
                  setActiveTab("upload");
                  setGeneratedForm([]);
                  setSelectedImage(null);
                  setImagePreview(null);
                  setPastedText("");
                  setFormName("Extracted Form");
                  setCurrentFormId(null);
                }}
                className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                Create New Form
              </button>
            </div>

            <FormBuilderEnhanced
              initialFormFields={generatedForm}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {/* Default Form (if no form generated) */}
        {activeTab === "form" && generatedForm.length === 0 && (
          <div>
            {/* Form Name Editor */}
            <div className="mb-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                {isEditingFormName ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={tempFormName}
                      onChange={(e) => setTempFormName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateFormName();
                        if (e.key === "Escape") setIsEditingFormName(false);
                      }}
                      className="flex-1 px-4 py-2 text-xl font-bold border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter form name"
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateFormName}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      title="Save"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsEditingFormName(false)}
                      className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-800">
                      {formName}
                    </h2>
                    <button
                      onClick={() => {
                        setTempFormName(formName);
                        setIsEditingFormName(true);
                      }}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit form name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {defaultFormFields.length}{" "}
                {defaultFormFields.length === 1 ? "field" : "fields"} (default)
              </p>
            </div>

            <div className="mb-4 flex items-center justify-end">
              <button
                onClick={() => {
                  setActiveTab("upload");
                  setGeneratedForm([]);
                  setSelectedImage(null);
                  setImagePreview(null);
                  setPastedText("");
                  setFormName("Extracted Form");
                  setCurrentFormId(null);
                }}
                className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                Create New Form
              </button>
            </div>

            <FormBuilderEnhanced
              initialFormFields={defaultFormFields}
              onSubmit={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
}
