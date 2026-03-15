import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { geistSans, geistMono } from '@/lib/fonts';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
export const metadata: Metadata = {
  title: 'STARKREP | Precision Strength Tracking',
  description: 'Strength workout tracking for the dedicated athlete.',
  openGraph: {
    title: 'STARKREP',
    description: 'Precision Strength Tracking',
    url: 'https://starkrep.com',
    siteName: 'StarkRep',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?q=80&w=1170&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'StarkRep',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#ef4444',
        },
      }}
    >
      <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
        >
          <Navbar />

          <main className="grow pt-20 pb-6 md:pt-24 md:pb-12 max-w-7xl mx-auto w-full px-4 not-italic">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#09090b',
                color: '#ef4444',
                border: '1px solid #7f1d1d',
                fontWeight: '900',
                textTransform: 'uppercase' as const,
                fontStyle: 'italic',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
