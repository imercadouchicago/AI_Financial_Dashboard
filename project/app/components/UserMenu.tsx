"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push('/');
  };

  if (!isOpen) return null;

  const menuItems = [
    { href: '/profile', label: 'Your Profile' },
    { href: '/settings', label: 'Settings' }
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50">
        {user && (
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
            <p className="text-xs truncate">{user.email}</p>
          </div>
        )}
        
        {menuItems.map(item => (
          <a key={item.href} href={item.href} className="block px-4 py-2 text-sm">
            {item.label}
          </a>
        ))}
        
        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm">
          Sign out
        </button>
      </div>
    </>
  );
};

export default UserMenu;