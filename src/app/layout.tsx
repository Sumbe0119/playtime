import type { Metadata } from 'next';
import { Inter, DM_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700']
});

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400']
});

export const metadata: Metadata = {
  title: 'OnTime Aviation',
  description:
    'OnTime Aviation Web, Rent a helicopter in Mongolia, Aviation permits and regulations Mongolia, Mongolia aviation services, Private charter flights Mongolia',
  keywords: [
    'Mongolia aviation',
    'Charter flights',
    'Helicopter rental Mongolia',
    'OnTime Aviation',
    'Mongolian Airtaxi',
    'OnTime Airtaxi',
    'Helicopter'
  ],
  viewport:
    'width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1, user-scalable=no'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmMono.variable} ${inter.className} antialiased tracking-tighter`}>
        {children}
      </body>
    </html>
  );
}
