// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import GNB from '@/components/GNB';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <GNB />
        {/* GNB 높이만큼 패딩을 줘서 본문이 가려지지 않게 함 */}
        <div style={{ paddingTop: '60px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
