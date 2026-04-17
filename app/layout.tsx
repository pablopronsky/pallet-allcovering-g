import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Nuevo Parket — Control de Consignación',
  description: 'Sistema de control de stock y consignación',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={inter.variable}>
      <body className="font-sans antialiased bg-[var(--bg-main)] text-[var(--text-main)]">
        {children}
      </body>
    </html>
  );
}
