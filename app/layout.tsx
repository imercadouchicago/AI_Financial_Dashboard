// app/layout.tsx file

import { ReactNode } from 'react';
import './globals.css';
import { Providers } from './providers'; // Import the new Providers component

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
