import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PDFViewerModal from './PDFViewerModal.jsx';
import DeleteConfirmModal from './DeleteConfirmModal.jsx';

export default function DocumentList({ refresh }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const fetchDocuments = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      //api changes
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/documents/${user.id}`);
      setDocuments(res.data.documents);
    } catch (err) {
      setError('Failed to fetch documents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, [refresh, user]);

  const initiateDelete = (doc) => {
    setDocToDelete(doc);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/documents/${user.id}/${docToDelete.filename}`);
      fetchDocuments();
      setDeleteModalOpen(false);
      setDocToDelete(null);
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDocToDelete(null);
  };

  const handleSign = (doc) => {
    navigate(`/sign/${doc._id}`);
  };

  const handleView = async (doc) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/documents/${doc.userId}/${doc.filename}`, {
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
                  <button className="text-red-600 hover:underline" onClick={() => initiateDelete(doc)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <PDFViewerModal fileUrl={modalUrl} open={modalOpen} onClose={handleCloseModal} />
      <DeleteConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={cancelDelete} 
        onConfirm={confirmDelete} 
        fileName={docToDelete?.originalName} 
      />
    </div>
  );
} 