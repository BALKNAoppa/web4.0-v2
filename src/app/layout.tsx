import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AxeProvider } from "@/components/axe-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Header } from "@/components/layout/header";
import { ChatWidget } from "@/components/chatbot/chat-widget";
import { AccessibilityProvider } from "@/components/accessibility/accessibility-provider";
import { AccessibilityPanel } from "@/components/accessibility/accessibility-panel";
import { AccessibilitySkipLinks } from "@/components/accessibility/accessibility-skip-links";
import { BRAND, BRAND_LABEL, BRAND_LOGO } from "@/lib/brand";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

/**
 * Tab-ын гарчиг ба icon нь БРЭНДЭЭР ялгаатай — NEXT_PUBLIC_BRAND-аас (build-ийн
 * үед) шийдэгдэнэ. Анхаар: app/icon.svg байвал file-based metadata нь энэ
 * `icons` тохиргоог ДАРДАГ тул тэр файлыг public/ рүү зөөсөн.
 */
export const metadata: Metadata = {
  title: `${BRAND_LABEL[BRAND]} 4.0 - Sample`,
  description: `${BRAND_LABEL[BRAND]} Web 4.0 — The future of connectivity`,
  icons: { icon: BRAND_LOGO[BRAND].icon },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccessibilityProvider>
            <AxeProvider>
              <AuthProvider>
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
