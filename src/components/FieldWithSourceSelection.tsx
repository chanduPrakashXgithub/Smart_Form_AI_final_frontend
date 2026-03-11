import { useState } from "react";
import axios from "axios";
import AlternativesDropdown from "./AlternativesDropdown";
import { ChevronDown, Check } from "lucide-react";

interface Variant {
  value: string;
  source: string;
  confidence: number;
  id: string;
}

interface FieldWithSourceSelectionProps {
  field: {
    formField: string;
    current: {
      value: string;
      source: string;
      confidence: number;
    } | null;
    alternatives: Variant[];
    totalSources: number;
    status: "filled" | "missing";
    userCanOverride: boolean;
  };
  currentValue?: { value: string; source: string };
  onChangeVariant: (value: string, source: string) => void;
}

export default function FieldWithSourceSelection({
  field,
  currentValue,
  onChangeVariant,
}: FieldWithSourceSelectionProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [variants, setVariants] = useState<any>(null);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Fetch variants when dropdown opened
  async function fetchVariants() {
    if (variants) {
      setShowAlternatives(!showAlternatives);
      return;
    }

    setLoadingVariants(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/autofill/get-variants`,
        { fieldName: field.formField },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setVariants(response.data);
      setShowAlternatives(true);
    } catch (err) {
      console.error("Error fetching variants:", err);
    } finally {
      setLoadingVariants(false);
    }
  }

  // Get source color
  function getSourceColor(source: string): string {
    const colors: Record<string, string> = {
      AADHAAR: "bg-green-100 text-green-800 border-green-300",
      PASSPORT: "bg-blue-100 text-blue-800 border-blue-300",
      PAN: "bg-purple-100 text-purple-800 border-purple-300",
      TENTH: "bg-yellow-100 text-yellow-800 border-yellow-300",
      INTER: "bg-orange-100 text-orange-800 border-orange-300",
      DEGREE: "bg-indigo-100 text-indigo-800 border-indigo-300",
    };
    return colors[source] || "bg-gray-100 text-gray-800 border-gray-300";
  }

  // EMPTY STATE - Field not filled
  if (!currentValue || field.status === "missing") {
    return (
      <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.formField}
        </label>
        <input
          type="text"
          placeholder="Not auto-filled - enter manually"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-500 mt-2">
          ⚠️ Data not found in your vault
        </p>
      </div>
    );
  }

  // FILLED STATE - Field with auto-filled value
  return (
    <div className="p-4 bg-white border-2 border-green-300 rounded-lg hover:shadow-md transition-shadow">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {field.formField}
      </label>

      <div className="flex items-center gap-2 mb-3">
        {/* AUTO-FILLED VALUE */}
        <input
          type="text"
          value={currentValue.value}
          readOnly
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-gray-800 font-medium"
        />

        {/* SOURCE BADGE */}
        <div
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border font-semibold text-sm whitespace-nowrap ${getSourceColor(
            currentValue.source,
          )}`}
        >
          <Check className="w-4 h-4" />
          {currentValue.source}
        </div>

        {/* CHANGE SOURCE BUTTON - Only if alternatives exist */}
        {field.alternatives && field.alternatives.length > 0 && (
          <button
            type="button"
            onClick={fetchVariants}
            disabled={loadingVariants}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-1 font-medium transition-colors"
          >
            <span>📄 {field.alternatives.length}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showAlternatives ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* CONFIDENCE INDICATOR */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">Confidence</span>
          <span className="text-xs font-semibold text-green-600">
            {Math.round(field.current?.confidence! * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full"
            style={{
              width: `${field.current?.confidence! * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* SHOW ALTERNATIVES DROPDOWN */}
      {showAlternatives && variants && (
        <AlternativesDropdown
          alternatives={variants.alternatives}
          currentSource={currentValue.source}
          onSelect={(value, source) => {
            onChangeVariant(value, source);
            setShowAlternatives(false);
          }}
        />
      )}
    </div>
  );
}
