import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  FileUp,
  BarChart3,
  LogOut,
  Database,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import DocumentUploadModal from "../components/DocumentUploadModal";
import { Link } from "react-router-dom";
import { statsService } from "../services/api";
import "../styles/animations.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stats, setStats] = useState({
    documentsUploaded: 0,
    fieldsExtracted: 0,
    autofillsUsed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getQuickStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                VisionForm Assist
              </h1>
              <p className="text-slate-600 text-base mt-1">
                Welcome back,{" "}
                <span className="font-medium text-slate-900">
                  {user?.fullName}
                </span>
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-pulse"
                >
                  <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {stats.documentsUploaded}
                  </div>
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  Documents
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {stats.fieldsExtracted}
                  </div>
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  Fields Extracted
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {stats.autofillsUsed}
                  </div>
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  Autofills Used
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">
                    {Math.round(
                      (stats.autofillsUsed /
                        Math.max(stats.fieldsExtracted, 1)) *
                        100,
                    )}
                    %
                  </div>
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  Efficiency
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Upload Card */}
          <div
            onClick={() => setShowUploadModal(true)}
            className="group bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <FileUp className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Upload
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upload documents to your secure vault
            </p>
          </div>

          {/* Data Vault Card */}
          <Link to="/vault" className="block">
            <div className="group bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all h-full">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                <Database className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Data Vault
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                View and manage stored documents
              </p>
            </div>
          </Link>

          {/* Assisted Filling Card */}
          <Link to="/form-assist" className="block">
            <div className="group bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-purple-200 transition-all h-full">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                <Sparkles className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Assisted Filling
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart suggestions for form filling
              </p>
            </div>
          </Link>

          {/* Dynamic Forms Card */}
          <Link to="/form-builder" className="block">
            <div className="group bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-lg hover:border-orange-200 transition-all h-full">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-orange-100 transition-colors">
                <Zap className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Dynamic Forms
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI-powered form generation
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}
