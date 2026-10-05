import type { Metadata } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nahyan // Studio Suite - Video Editor Financial Cockpit',
  description: 'Clean monochrome studio earnings telemetry, project deliverables, and currency intelligence for freelance video editors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable}`} suppressHydrationWarning>
      <body className={`font-sans min-h-screen antialiased bg-black text-white selection:bg-white selection:text-black`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js?token=1b1ee6de-eb47-4c48-8083-e2f69d8963ca"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
