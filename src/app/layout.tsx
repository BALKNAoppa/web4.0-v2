import type { Metadata, Viewport } from "next";
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

/**
 * `theme-color` — МОБАЙЛ ХӨТЧИЙН UI зурвасын өнгө.
 *
 * ⚠️ ЯАГААД НЭМЭГДСЭН (2026-09-07): meta огт байхгүй үед iOS Safari / Android
 * Chrome нь зурвасаа `color-scheme`-ээс таамагладаг. Манай `html` дээр
 * `color-scheme: dark` суудаг тул хуудасны ДООД талд ХАР зурвас гарч, "дэлгэцэндээ
 * багтахгүй, доор хар хэсэг байна" гэсэн шинж үүсгэж байв. DevTools нь хөтчийн
 * ӨӨРИЙН UI-г зурдаггүй тул тэнд ХЭЗЭЭ Ч давтагдахгүй — яг захиалагчийн
 * "Dev tools дээр бүр харагдахгүй" гэсэнтэй тохирно.
 *
 * Өнгө нь `globals.css`-ийн `--background-1`-тэй ЯГ ИЖИЛ байх ёстой
 * (light #e2e8ec · dark #10131b). Тэр хувьсагчийг өөрчилвөл ЭНД БАС засна —
 * meta нь CSS хувьсагч уншиж чаддаггүй тул hex давхардаж бичигдэх нь
 * гарцаагүй.
 *
 * ⚠️ ХЯЗГААР: `media` нь ОПЕРАЦИЙН СИСТЕМИЙН сонголтыг л уншина. Хэрэглэгч
 * `next-themes`-ээр гараар light сонгоод OS нь dark байвал зурвас бараан
 * хэвээр үлдэнэ. Бүрэн зөв болгох бол client дээр `theme` солигдох үед
 * meta-г JS-ээр шинэчлэх шаардлагатай — одоогоор хийгээгүй.
 *
 * ⚠️ `maximumScale` / `userScalable` ЗОРИУД ТАВИААГҮЙ — тэдгээр нь хуруугаар
 * томруулахыг хориглож WCAG 1.4.4-ийг зөрчинө.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e2e8ec" },
    { media: "(prefers-color-scheme: dark)", color: "#10131b" },
  ],
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
