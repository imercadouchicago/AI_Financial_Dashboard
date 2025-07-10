import { ReactNode } from 'react';
import { Providers } from './providers';
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
        <Providers attribute="data-theme" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}