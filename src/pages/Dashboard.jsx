import Navbar from '../components/Navbar.jsx';
import DocumentUpload from '../components/DocumentUpload.jsx';
import DocumentList from '../components/DocumentList.jsx';
import { useState } from 'react';

export default function Dashboard() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <DocumentUpload onUpload={() => setRefresh((r) => r + 1)} />
        <DocumentList refresh={refresh} />
      </div>
    </div>
  );
} 