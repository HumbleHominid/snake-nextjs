import type { Metadata } from 'next';
import '@/app/globals.css';
import { inter } from '@/app/ui/fonts';
import Footer from '@/app/ui/footer/footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Snake Game',
  description: 'The official Snake Game clone created by Michael Fryer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-slate-900 antialiased`}>
        {/* Vercel Analytics */}
        <Analytics />
        <div className="relative grid grid-rows-layout min-h-lvh justify-items-stretch">
          {/* Content */}
          <div className="z-10 overflow-hidden">
            <div className=" p-4 w-11/12 lg:w-2/3 m-auto">
              {children}
            </div>
          </div>
          {/* Footer */}
          <div className="z-10 row-start-4 my-4">
            <Footer/>
          </div>
        </div>
      </body>
    </html>
  );
}
