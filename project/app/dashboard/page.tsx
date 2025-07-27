"use client";

import React from 'react';
import Layout from '../components/Layout';

// Dashboard card component
interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  linkText?: string;
  linkHref?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  linkText = "View all", 
  linkHref = "#" 
}) => (
  <div className="overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 rounded-md p-3">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium truncate">{title}</dt>
            <dd className="text-lg font-medium">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
    <div className="px-5 py-3">
      <div className="text-sm">
        <a href={linkHref} className="font-medium">{linkText}</a>
      </div>
    </div>
  </div>
);

// Currency icon component
const CurrencyIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Users icon component
const UsersIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

// Chart icon component
const ChartIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Dashboard cards configuration
const dashboardCards = [
  {
    id: 'balance',
    title: 'Total Balance',
    value: '$0.00',
    icon: <CurrencyIcon />,
    linkHref: '/balance'
  },
  {
    id: 'users',
    title: 'Active Users',
    value: '1,234',
    icon: <UsersIcon />,
    linkHref: '/users'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    value: '98.5%',
    icon: <ChartIcon />,
    linkHref: '/analytics'
  }
];

export default function DashboardPage() {
  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map(card => (
          <DashboardCard 
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            linkHref={card.linkHref}
          />
        ))}
      </div>
    </Layout>
  );
}