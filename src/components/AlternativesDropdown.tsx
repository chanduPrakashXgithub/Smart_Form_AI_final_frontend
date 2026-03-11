import { CheckCircle, Circle } from "lucide-react";

interface Alternative {
  value: string;
  source: string;
  confidence: number;
  id: string;
}

interface AlternativesDropdownProps {
  alternatives: Alternative[];
  currentSource: string;
  onSelect: (value: string, source: string) => void;
}

export default function AlternativesDropdown({
  alternatives,
  currentSource,
  onSelect,
}: AlternativesDropdownProps) {
  // Get source color
  function getSourceColor(source: string): string {
    const colors: Record<string, string> = {
      AADHAAR: "bg-green-50 border-green-200 hover:bg-green-100",
      PASSPORT: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      PAN: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      TENTH: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      INTER: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      DEGREE: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    };
    return colors[source] || "bg-gray-50 border-gray-200 hover:bg-gray-100";
  }

  function getSourceDotColor(source: string): string {
    const colors: Record<string, string> = {
      AADHAAR: "text-green-600",
      PASSPORT: "text-blue-600",
      PAN: "text-purple-600",
      TENTH: "text-yellow-600",
      INTER: "text-orange-600",
      DEGREE: "text-indigo-600",
    };
    return colors[source] || "text-gray-600";
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
        📄 Switch document source:
      </p>

      <div className="space-y-2">
        {alternatives.map((alt, idx) => (
          <button
            key={alt.id || idx}
            onClick={() => onSelect(alt.value, alt.source)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              alt.source === currentSource
                ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                : `border-gray-200 ${getSourceColor(alt.source)}`
            }`}
          >
            <div className="flex items-start gap-3">
              {/* ICON */}
              <div className="flex-shrink-0 mt-0.5">
                {alt.source === currentSource ? (
                  <CheckCircle
                    className={`w-5 h-5 ${getSourceDotColor(alt.source)}`}
                  />
                ) : (
                  <Circle
                    className={`w-5 h-5 ${getSourceDotColor(alt.source)}`}
                  />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">{alt.source}</p>
                    <p className="text-gray-600 font-medium break-words">
                      {alt.value}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700">
                      {Math.round(alt.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {alt.source === currentSource && (
                  <p className="text-xs text-green-600 mt-1 font-semibold">
                    ✓ Currently selected
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Click any alternative to switch sources
      </p>
    </div>
  );
}
