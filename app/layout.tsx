import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'US Ticker Price',
  description: 'Zobrazení aktuální ceny amerických akcií',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
