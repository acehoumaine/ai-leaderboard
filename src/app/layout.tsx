import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Leaderboard - Independent AI Model Rankings",
    template: "%s | AI Leaderboard"
  },
  description: "Comprehensive rankings and analysis of AI models based on independent benchmarks, performance metrics, and real-world testing. Compare GPT, Claude, Gemini, and more.",
  keywords: ["AI models", "LLM leaderboard", "artificial intelligence", "model comparison", "AI benchmarks", "GPT", "Claude", "Gemini"],
  authors: [{ name: "AI Leaderboard Team" }],
  creator: "AI Leaderboard",
  publisher: "AI Leaderboard",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.ai-fun-ranking.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AI Leaderboard - Independent AI Model Rankings',
    description: 'Comprehensive rankings and analysis of AI models based on independent benchmarks and real-world testing.',
    siteName: 'AI Leaderboard',
    images: [
      {
        url: '/globe.svg',
        width: 32,
        height: 32,
        alt: 'AI Leaderboard Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Leaderboard - Independent AI Model Rankings',
    description: 'Comprehensive rankings and analysis of AI models based on independent benchmarks.',
    images: ['/globe.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/globe.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </body>
    </html>
  );
}
