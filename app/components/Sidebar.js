import React from 'react';

const Sidebar = ({ isOpen }) => {
  return (
    <aside
      className={`bg-gray-800 text-white fixed h-full left-0 top-0 transition-all duration-300 z-20 overflow-hidden ${
        isOpen ? 'w-64' : 'w-0'
      }`}
    >
      <nav className="p-5">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-center">Isabella Mercado</h2>
        </div>
        <ul className="space-y-4">
          <li>
            <a href="/" className="block text-lg hover:text-blue-300 transition-colors">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/analytics" className="block text-lg hover:text-blue-300 transition-colors">
              Analytics
            </a>
          </li>
          <li>
            <a href="/about" className="block text-lg hover:text-blue-300 transition-colors">
              About
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;