import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="font-bold text-lg">
        <Link to="/dashboard">Signsy</Link>
      </div>
      <div className="flex items-center gap-4">
        {user && <span className="hidden sm:inline">Hello, {user.name}</span>}
        <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100">Logout</button>
      </div>
    </nav>
  );
} 