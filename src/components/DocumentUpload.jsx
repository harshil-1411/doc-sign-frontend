import { useState } from 'react';
import axios from 'axios';

export default function DocumentUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
    setProgress(0);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append('pdf', file);
    setError('');
    setSuccess('');
    setProgress(0);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });
      setSuccess('File uploaded successfully!');
      setFile(null);
      setProgress(0);
      if (onUpload) onUpload(res.data.document);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleUpload} className="bg-white p-6 rounded shadow mb-6 flex flex-col gap-4">
      <label className="font-semibold">Upload PDF Document</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="border rounded px-3 py-2"
      />
      {progress > 0 && <div className="text-blue-600">Uploading: {progress}%</div>}
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit">Upload</button>
    </form>
  );
} 