"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Search, User, LogOut, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth/auth-provider";
import { ecosystemBrands } from "@/data/navigation";

// =====================================================================
// ХУВИЛБАР 1 — Apple-аас санаа авсан нэгдсэн эко-системийн nav.
// "Header" гэж тусдаа байхгүй — ганц нимгэн navigation мөр.
// Зүүн: жижиг лого · Төв: группын брэндүүд · Баруун: хайлт + профайл.
// =====================================================================
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="bg-background/80 border-border sticky top-0 z-50 border-b backdrop-blur"
      role="banner"
    >
      {/* ===== Desktop — зүүн лого · төв брэндүүд · баруун хайлт+профайл ===== */}
      <div className="mx-auto hidden h-11 max-w-[1200px] grid-cols-[1fr_auto_1fr] items-center px-4 lg:grid">
        <div className="flex items-center">
          <EcoLogo />
        </div>

        <nav aria-label="Эко-систем" className="flex items-center justify-center gap-7">
          {ecosystemBrands.map((brand) => (
            <a
              key={brand.name}
              href={brand.href}
              target={brand.external ? "_blank" : undefined}
              rel={brand.external ? "noopener noreferrer" : undefined}
              className="text-foreground/75 hover:text-foreground text-[13px] font-medium transition-colors"
            >
              {brand.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-0.5">
          <IconButton label="Хайх">
            <Search className="size-4" />
          </IconButton>
          <AccountMenu />
        </div>
      </div>

      {/* ===== Mobile — лого + хайлт/профайл + hamburger ===== */}
      <div className="mx-auto flex h-11 max-w-[1200px] items-center justify-between px-4 lg:hidden">
        <EcoLogo />

        <div className="flex items-center gap-0.5">
          <IconButton label="Хайх">
            <Search className="size-5" />
          </IconButton>
          <AccountMenu />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Цэс нээх">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-75 p-6 sm:w-90">
              <SheetHeader className="p-0">
                <SheetTitle>Эко-систем</SheetTitle>
              </SheetHeader>

              <ul className="mt-4 space-y-1">
                {ecosystemBrands.map((brand) => (
                  <li key={brand.name}>
                    <a
                      href={brand.href}
                      target={brand.external ? "_blank" : undefined}
                      rel={brand.external ? "noopener noreferrer" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-2.5 text-sm font-medium transition-colors"
                    >
                      <span>{brand.name}</span>
                      <ArrowUpRight
                        className="text-muted-foreground ml-auto size-4"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// =====================================================================
// Туслах компонентууд
// =====================================================================

/**
 * Эко-системийн жижиг лого (Apple шиг). Одоогоор univision лого-г placeholder
 * болгосон — жинхэнэ жижиг эко-логог өгмөгц энд (src) солино.
 */
function EcoLogo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Нүүр">
      <Image
        src="/univision-logo.svg"
        alt="Эко-систем"
        width={120}
        height={28}
        priority
        className="h-5 w-auto dark:hidden"
      />
      <Image
        src="/univision-logo-dark.svg"
        alt="Эко-систем"
        width={120}
        height={28}
        priority
        className="hidden h-5 w-auto dark:block"
      />
    </Link>
  );
}

/**
 * Account товч — нэвтрээгүй бол login dialog нээнэ, нэвтэрсэн бол хэрэглэгчийн
 * нэр + "Гарах"-тай dropdown харуулна.
 */
function AccountMenu() {
  const { isAuthenticated, user, openLogin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Button variant="ghost" size="icon" aria-label="Нэвтрэх" onClick={() => openLogin()}>
        <User className="size-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Миний бүртгэл" className="relative">
          <User className="size-5" />
          <span
            className="bg-primary ring-background absolute top-1.5 right-1.5 size-2 rounded-full ring-2"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <span className="block text-sm font-semibold">{user?.name}</span>
          <span className="text-muted-foreground block text-xs font-normal">Нэвтэрсэн</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Гарах
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Icon-only ghost button */
function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Button variant="ghost" size="icon" aria-label={label}>
      {children}
    </Button>
  );
}
