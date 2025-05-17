// app/layout.tsx file

import { ReactNode } from 'react';
import { Providers } from './providers'; // Import the new Providers component
import { AuthProvider } from './context/AuthContext';
import { EB_Garamond } from 'next/font/google';
import './globals.css';

const ebGaramond = EB_Garamond({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ebGaramond.className}>
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
