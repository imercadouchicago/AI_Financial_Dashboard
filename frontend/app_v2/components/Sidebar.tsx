import React from 'react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={`fixed h-full left-0 top-0 transition-all duration-300 z-20 overflow-hidden ${isOpen ? 'w-64' : 'w-0'}`}>
      <nav className="p-5">
        <h2 className="text-xl font-bold text-center mb-10">Isabella Mercado</h2>
        <ul className="space-y-4">
          <li><a href="/" className="block text-lg">Dashboard</a></li>
          <li><a href="/analytics" className="block text-lg">Analytics</a></li>
          <li><a href="/about" className="block text-lg">About</a></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;