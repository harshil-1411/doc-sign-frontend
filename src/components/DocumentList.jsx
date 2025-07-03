import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PDFViewerModal from './PDFViewerModal.jsx';

export default function DocumentList({ refresh }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/${user.id}`);
      setDocuments(res.data.documents);
    } catch (err) {
      setError('Failed to fetch documents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [refresh, user]);

//delete document
  const handleDelete = async (filename) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/documents/${user.id}/${filename}`);
      fetchDocuments();
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  const handleSign = (doc) => {
    navigate(`/sign/${doc._id}`);
  };

  const handleView = async (doc) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents/${doc.userId}/${doc.filename}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setModalUrl(url);
      setModalOpen(true);
    } catch (err) {
      alert('Failed to load PDF');
    }
  };

  const handleCloseModal = () => {
    if (modalUrl) URL.revokeObjectURL(modalUrl);
    setModalOpen(false);
    setModalUrl('');
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">My Documents</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : documents.length === 0 ? (
        <div>No documents uploaded yet.</div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th>Date</th>
              <th>Size</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id} className="border-t">
                <td className="py-2">{doc.originalName.replace(/\.pdf$/i, '')}</td>
                <td>{new Date(doc.dateUploaded).toLocaleString()}</td>
                <td>{(doc.size / 1024).toFixed(1)} KB</td>
                <td>{doc.status}</td>
                <td className="space-x-2">
                  <button className="text-blue-600 hover:underline" onClick={() => handleSign(doc)}>View & Sign</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(doc.filename)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <PDFViewerModal fileUrl={modalUrl} open={modalOpen} onClose={handleCloseModal} />
    </div>
  );
} 