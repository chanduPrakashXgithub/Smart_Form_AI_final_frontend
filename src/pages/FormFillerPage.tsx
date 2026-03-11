import { useState } from "react";
import FormWithSourceSelection from "../components/FormWithSourceSelection";
import { ArrowLeft } from "lucide-react";

export default function FormFillerPage() {
  const [formFields, setFormFields] = useState<string[]>([
    "Full Name",
    "Date of Birth",
    "Father Name",
    "Address",
    "10th Percentage",
    "12th Percentage",
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [step, setStep] = useState<"input" | "form">("input");
  const [customFields, setCustomFields] = useState("");

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log("📤 Form submitted with:", data);
    setSubmittedData(data);
    setSubmitted(true);

    // Simulate API call
    setTimeout(() => {
      alert("✅ Form submitted successfully!");
      handleReset();
    }, 1500);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmittedData(null);
    setStep("input");
    setCustomFields("");
  };

  const handleCustomFields = () => {
    if (customFields.trim()) {
      const fields = customFields
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
      if (fields.length > 0) {
        setFormFields(fields);
        setStep("form");
      }
    }
  };

  // SUBMITTED STATE
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your form has been submitted successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto text-left">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Submitted Data:
            </p>
            {submittedData && (
              <div className="space-y-2">
                {Object.entries(submittedData).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600 ml-2">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Fill Another Form
          </button>
        </div>
      </div>
    );
  }

  // FORM INPUT STEP
  if (step === "input") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Fill Form with Auto-Fill
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <p className="text-gray-700 mb-4">
              Choose a sample form or paste your own form fields (one per line):
            </p>

            {/* PRESET FORMS */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                📋 Or select a sample form:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setFormFields([
                      "Full Name",
                      "Date of Birth",
                      "Father Name",
                      "Address",
                      "10th Percentage",
                      "12th Percentage",
                    ]);
                    setStep("form");
                  }}
                  className="p-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition text-left font-medium text-gray-800"
                >
                  📚 Student Form
                </button>

                <button
                  onClick={() => {
                    setFormFields([
                      "Full Name",
                      "Email",
                      "Phone",
                      "Date of Birth",
                      "Address",
                      "Current Address",
                      "Father Name",
                      "Mother Name",
                    ]);
                    setStep("form");
                  }}
                  className="p-4 border-2 border-green-300 rounded-lg hover:bg-green-50 transition text-left font-medium text-gray-800"
                >
                  🏢 Application Form
                </button>

                <button
                  onClick={() => {
                    setFormFields([
                      "Full Name",
                      "Permanent Address",
                      "Date of Birth",
                      "Gender",
                      "Father Name",
                      "Phone Number",
                      "Email Address",
                    ]);
                    setStep("form");
                  }}
                  className="p-4 border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition text-left font-medium text-gray-800"
                >
                  🏛️ Government Form
                </button>

                <button
                  onClick={() => {
                    setFormFields([
                      "Candidate Name",
                      "Date of Birth",
                      "Email",
                      "Current Address",
                      "Phone Number",
                      "Father Name",
                      "Educational Qualification",
                    ]);
                    setStep("form");
                  }}
                  className="p-4 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition text-left font-medium text-gray-800"
                >
                  💼 Job Application
                </button>
              </div>
            </div>

            {/* CUSTOM FORM */}
            <div className="border-t pt-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                ✏️ Or paste custom form fields:
              </p>
              <textarea
                value={customFields}
                onChange={(e) => setCustomFields(e.target.value)}
                placeholder={`Enter form fields (one per line):\nFull Name\nDate of Birth\nAddress\n...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 font-mono text-sm"
                rows={6}
              />

              <button
                onClick={handleCustomFields}
                disabled={!customFields.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Fill Form →
              </button>
            </div>
          </div>

          {/* TIPS */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 Pro Tips:</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>✓ The system will auto-fill with data from your vault</li>
              <li>
                ✓ Click on any field to see alternatives from other documents
              </li>
              <li>
                ✓ Switch between Aadhaar, 10th, 12th, BTech sources easily
              </li>
              <li>✓ System learns your preferences over time</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // FORM FILLING STEP
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setStep("input")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {formFields.length} fields detected
            </p>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      <FormWithSourceSelection
        formFields={formFields}
        onSubmit={handleFormSubmit}
        onCancel={() => setStep("input")}
      />
    </div>
  );
}
