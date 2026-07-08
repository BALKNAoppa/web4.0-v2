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
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Univision 4.0 - Sample",
  description: "Univision Web 4.0 — The future of connectivity",
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
