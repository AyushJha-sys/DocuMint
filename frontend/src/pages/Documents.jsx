import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get("/documents");
        setDocuments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        toast.error("Could not load documents history.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document from your history?")) return;
    
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      toast.success("Document removed");
    } catch (err) {
      toast.error("Could not delete document");
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 text-left">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Documents</h1>
          <p className="text-gray-500 dark:text-gray-400 text-left">Your history of signed and uploaded PDFs.</p>
        </div>
        <div className="bg-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg shadow-indigo-500/20 font-medium">
          Total History: {documents.length}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white dark:bg-gray-900/40 dark:backdrop-blur-md border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-20 text-center">
          <div className="text-6xl mb-6">📄</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 font-body">No documents yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">Upload a PDF in the editor to start building your history.</p>
          <a href="/editor" className="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md transform hover:scale-105">
            Go to Editor
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {documents.map((doc) => (
            <div 
              key={doc._id} 
              className="group bg-white dark:bg-gray-900/40 dark:backdrop-blur-md border border-gray-200 dark:border-gray-800/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-1 text-left">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-2xl text-indigo-600 dark:text-indigo-400">
                    PDF
                  </div>
                  <button 
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-100 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    title="Delete document"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate" title={doc.filename}>
                  {doc.filename}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(doc.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                  })} • {new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-700/50 flex gap-3">
                <button
                  onClick={async () => {
                    try {
                      const response = await api.get(`/documents/${doc._id}/download`, {
                        responseType: 'blob'
                      });
                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', doc.filename);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      toast.success("Download started (10 credits deducted)");
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Download failed");
                    }
                  }}
                  className="flex-1 text-center py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}