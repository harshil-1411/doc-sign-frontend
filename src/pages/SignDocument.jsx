import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import PDFViewer from "../components/PDFViewer.jsx";
import SignatureCreator from "../components/SignatureCreator.jsx";
import DraggableSignature from "../components/DraggableSignature.jsx";

export default function SignDocument() {
  const { docId } = useParams();
  const [doc, setDoc] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signature, setSignature] = useState({ text: "", font: "cursive" });
  const [sigPos, setSigPos] = useState(null);
  const [signing, setSigning] = useState(false);
  const [success, setSuccess] = useState("");
  const [signError, setSignError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/documents/${JSON.parse(localStorage.getItem("user")).id}`
        );
        const found = res.data.documents.find((d) => d._id === docId);
        setDoc(found);
        if (found) {
          let pdfEndpoint =
            found.status === "signed"
              ? `${import.meta.env.VITE_API_BASE_URL}/api/documents/signed/${found.userId}/${found.filename}`
              : `${import.meta.env.VITE_API_BASE_URL}/api/documents/${found.userId}/${found.filename}`;
          const pdfRes = await axios.get(pdfEndpoint, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const blob = new Blob([pdfRes.data], { type: "application/pdf" });
          setPdfUrl(URL.createObjectURL(blob));
        }
      } catch (err) {
        setError("Failed to load document");
      }
      setLoading(false);
    };
    fetchDoc();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [docId, success]);

  const handleDrop = (absPos) => {
    const canvas = document.querySelector(".rpv-core__canvas-layer canvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xPercent = (absPos.x - rect.left) / rect.width;
    const yPercent = (absPos.y - rect.top) / rect.height;
    setSigPos({ ...absPos, xPercent, yPercent });
  };

  const handleSign = async () => {
    if (!sigPos || !signature.text) {
      setSignError("Please place your signature on the document.");
      return;
    }
    setSigning(true);
    setSignError("");
    setSuccess("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/documents/sign`,
        {
          filename: doc.filename,
          userId: doc.userId,
          pageNumber: 0,
          xPercent: sigPos.xPercent,
          yPercent: sigPos.yPercent,
          signatureText: signature.text,
          font: signature.font,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuccess("Document signed successfully!");
    } catch (err) {
      setSignError("Failed to sign document");
    }
    setSigning(false);
  };

  const handleDownload = async () => {
    if (!doc) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/documents/signed/${doc.userId}/${doc.filename}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `signed-${doc.originalName}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download signed PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Sign Document</h1>
        <SignatureCreator
          onSignatureChange={(text, font) => setSignature({ text, font })}
        />
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : doc && pdfUrl ? (
          <div className="relative w-full h-[80vh] border rounded shadow mb-4 overflow-auto">
            <PDFViewer fileUrl={pdfUrl} />
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
              {signature.text && (
                <DraggableSignature
                  text={signature.text}
                  font={signature.font}
                  position={sigPos || { x: 50, y: 50 }}
                  setPosition={(pos) => setSigPos(pos)}
                  onDrop={handleDrop}
                />
              )}
            </div>
          </div>
        ) : (
          <div>Document not found.</div>
        )}
        {signError && <div className="text-red-500 mb-2">{signError}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          onClick={handleSign}
          disabled={signing}
        >
          {signing ? "Signing..." : "Sign"}
        </button>
        {doc && doc.status === "signed" && (
          <>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4 ml-4"
              onClick={handleDownload}
            >
              Download Signed PDF
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mt-4 ml-4"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
