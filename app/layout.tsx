import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700']
});

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
    <html lang="es-AR" className={montserrat.variable}>
      <body className="font-sans antialiased text-[var(--np-fg-strong)]">
        {children}
      </body>
    </html>
  );
}
