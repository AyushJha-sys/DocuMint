import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PDFPreview from "../components/PDFPreview";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");
      if (Array.isArray(res.data)) {
        setDocuments(res.data);
      } else {
        setDocuments([]);
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      setLoading(true);

      await api.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSelectedFile(null);
      fetchDocuments();
    } catch {
      console.log("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px"
        }}
      >
        <h1>Your Documents</h1>
        <button
          onClick={handleLogout}
          style={{
            background: "red",
            padding: "10px 20px",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Upload Section */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #333",
          marginBottom: "30px"
        }}
      >
        <h2>Upload PDF</h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        {selectedFile && (
          <>
            <PDFPreview file={selectedFile} />

            <button
              onClick={handleUpload}
              disabled={loading}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "#4f46e5",
                border: "none",
                color: "white",
                cursor: "pointer"
              }}
            >
              {loading ? "Uploading..." : "Upload & Save"}
            </button>
          </>
        )}
      </div>

      {/* Document List */}
      {documents.length === 0 ? (
        <p>No documents signed yet.</p>
      ) : (
        documents.map((doc) => (
          <div
            key={doc._id}
            style={{
              padding: "15px",
              border: "1px solid #333",
              marginBottom: "10px"
            }}
          >
            <p>{doc.filename}</p>
            <a
              href={`http://localhost:5000/uploads/${doc.filename}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#60a5fa" }}
            >
              Download
            </a>
          </div>
        ))
      )}
    </div>
  );
}