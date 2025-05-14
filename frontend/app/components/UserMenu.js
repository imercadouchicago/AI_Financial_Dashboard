"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const UserMenu = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push('/');
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      ></div>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
        {user && (
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
        
        <a 
          href="/profile" 
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Your Profile
        </a>
        
        <a 
          href="/settings" 
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Settings
        </a>
        
        <button 
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </>
  );
};

export default UserMenu;