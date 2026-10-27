import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemePresetHydrator } from "@/components/ThemePresetHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tampa Bay Soft Wash Academy",
  description: "Operator training: SOPs, QA checklists, Proof Packs, and systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T693T1NRJF"
          strategy="afterInteractive"
        />
        <Script id="tbsoftwash-ga4-academy" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('set', 'linker', { 'domains': ['tbsoftwash.com', 'academy.tbsoftwash.com'] });
            gtag('config', 'G-T693T1NRJF', {
              'allow_google_signals': true,
              'allow_ad_personalization_signals': true,
              'page_category': 'academy'
            });
            document.addEventListener('click', function(e) {
              var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
              if (!link) return;
              var href = link.getAttribute('href') || '';
              if (href.indexOf('amazon.com/dp/') !== -1 || href.indexOf('amzn.to/') !== -1) {
                var m = href.match(/\\/dp\\/([A-Z0-9]{10})/i);
                gtag('event', 'affiliate_click', {
                  asin: m ? m[1] : 'unknown',
                  link_text: (link.textContent || '').trim().slice(0, 80),
                  destination_url: href,
                  page_category: 'academy'
                });
              } else if (href.indexOf('tel:') === 0) {
                gtag('event', 'click_to_call', {
                  phone_number: href.replace('tel:', ''),
                  page_category: 'academy'
                });
              }
            }, { passive: true });
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemePresetHydrator />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
