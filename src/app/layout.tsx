import type { Metadata, Viewport } from "next";
import { Manrope, Noto_Sans_JP, Noto_Sans_KR, Noto_Sans_SC } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AxeProvider } from "@/components/axe-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Header } from "@/components/layout/header";
import { ThemeColorMeta } from "@/components/layout/theme-color-meta";
import { ChatWidget } from "@/components/chatbot/chat-widget";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider";
import { AccessibilityPanel } from "@/components/accessibility/accessibility-panel";
import { AccessibilitySkipLinks } from "@/components/accessibility/accessibility-skip-links";
import { SampleTranslator } from "@/components/i18n/sample-translator";
import { BRAND, BRAND_LABEL, BRAND_LOGO } from "@/lib/brand";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const notoKR = Noto_Sans_KR({
  variable: "--font-noto-kr",
  display: "swap",
  preload: false,
  weight: ["400", "500", "700"],
});

const notoSC = Noto_Sans_SC({
  variable: "--font-noto-sc",
  display: "swap",
  preload: false,
  weight: ["400", "500", "700"],
});

const notoJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  display: "swap",
  preload: false,
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: `${BRAND_LABEL[BRAND]} 4.0 - Sample`,
  description: `${BRAND_LABEL[BRAND]} Web 4.0 — The future of connectivity`,
  icons: { icon: BRAND_LOGO[BRAND].icon },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#e2e8ec",
};

const THEME_COLOR_BOOTSTRAP = `(function(){try{var c=getComputedStyle(document.documentElement).backgroundColor;var p=/^rgba?\\(\\s*([\\d.]+)[\\s,]+([\\d.]+)[\\s,]+([\\d.]+)/.exec(c);if(!p)return;var h="#"+[p[1],p[2],p[3]].map(function(v){return ("0"+Math.round(Number(v)).toString(16)).slice(-2)}).join("");var m=document.querySelector('meta[name="theme-color"]:not([media])');if(!m){m=document.createElement("meta");m.setAttribute("name","theme-color");document.head.appendChild(m)}m.setAttribute("content",h)}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${manrope.variable} ${notoKR.variable} ${notoSC.variable} ${notoJP.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <script
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: THEME_COLOR_BOOTSTRAP }}
          />
          <AccessibilityProvider>
            <AxeProvider>
              <AuthProvider>
                <ThemeColorMeta />
                <SampleTranslator />
                <AccessibilitySkipLinks />
                <Header />
                {children}
                <ChatWidget />
                <AccessibilityPanel />
              </AuthProvider>
            </AxeProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
