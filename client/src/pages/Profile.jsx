import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
        <p className="text-gray-500 mb-4 text-sm sm:text-base">Please log in to view your profile.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              {user.name}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base truncate">{user.email}</p>
          </div>
        </div>
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-gray-600">Name</span>
            <span className="font-medium text-gray-900">{user.name}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-gray-600">Email</span>
            <span className="font-medium text-gray-900 truncate ml-4">{user.email}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-50 text-red-600 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-100 transition text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;