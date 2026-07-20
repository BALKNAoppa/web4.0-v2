/**
 * Univision Web 4.0 — Footer data
 *
 * Footer-ийн навигацийн линк болон компанийн нэр зэрэг
 * харьцангуй тогтвортой контентийг энд төвлөрүүлнэ.
 */

export type FooterLink = {
  id: string;
  label: string;
  href: string;
};

export const footerLinks: FooterLink[] = [
  { id: "about", label: "Бидний тухай", href: "#" },
  { id: "news", label: "Хэвлэлийн мэдээ", href: "#" },
  { id: "coverage", label: "Сүлжээний хамрах хүрээ", href: "#" },
  { id: "branches", label: "Салбарын байршил", href: "#" },
  { id: "contact", label: "Холбоо барих", href: "#" },
];

export const footerMeta = {
  /** "© Юнител ХХК" хэлбэрээр харагдана */
  copyrightOwner: "Юнител ХХК",
};