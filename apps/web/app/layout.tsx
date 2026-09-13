import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { PwaRegister } from '@/components/pwa-register';
import { SearchPalette } from '@/components/search-palette';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ZiLu — Build your Chinese vocabulary',
  description:
    'Traditional Chinese flashcards with pinyin and pronunciation for complete beginners.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#c1442c',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Apply the saved color family + day/night mode before paint so there is no flash of the wrong palette. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var f=localStorage.getItem('zilu:theme-family');f=(f==='cyberpunk'||f==='silkpunk'||f==='taopunk')?f:'silkpunk';var m=localStorage.getItem('zilu:theme-mode');if(m!=='day'&&m!=='night')m=localStorage.getItem('zilu:theme')==='dark'?'night':'day';document.documentElement.setAttribute('data-theme',f+'-'+m)}catch(e){}",
          }}
        />
        {children}
        <SearchPalette />
        <PwaRegister />
      </body>
    </html>
  );
}
