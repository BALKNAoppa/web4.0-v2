"use client";

import { useEffect } from "react";

/**
 * `--header-h` — header-ийн БОДИТ өндрийг CSS хувьсагч болгож `:root`-д бичнэ.
 *
 * ЯАГААД ХЭРЭГТЭЙ ВЭ: нүүрний hero нь "дэлгэцээс header-ийг хассан үлдсэн зай"
 * -г яг эзлэх ёстой (`h-[calc(100svh-var(--header-h))]`). Header нь `relative`
 * (sticky БИШ) тул хуудасны эхний дэлгэц = header + hero.
 *
 * ЯАГААД PX-ЭЭР HARDCODE ХИЙХГҮЙ ВЭ: өндөр нь breakpoint-оор өөрчлөгддөг
 * (хэмжсэн: мобайл 49px · desktop 78px) бөгөөд header-ийн бүтэц өөрчлөгдөхөд
 * (мөр нэмэх, лого томсгох) дахин зөрнө. ResizeObserver нь юу ч санахгүйгээр
 * үргэлж зөв утга өгнө.
 *
 * SSR: globals.css дотор media query-тэй FALLBACK утга байгаа тул сервер дээр ч
 * ойролцоо зөв зурагдана — hydration-ы дараа энэ нь яг тааруулна.
 */
export function HeaderHeightVar() {
  useEffect(() => {
    const root = document.documentElement;

    const apply = (el: Element) => {
      const h = el.getBoundingClientRect().height;
      // 0 бол header хараахан зурагдаагүй (эсвэл `display:none`) — CSS-ийн
      // fallback-ийг дарж 0 бичвэл hero дэлгэцээс халина.
      if (h > 0) root.style.setProperty("--header-h", `${Math.round(h)}px`);
    };

    /**
     * Header нь хувилбар солиход ДАХИН МОУНТ хийгддэг (`LogoLeftHeader` ↔
     * `TopClassifierHeader`) тул нэг удаа олоод барьж болохгүй — хуучин
     * элемент дээр observer үлдэнэ. Тиймээс `<body>`-г ажиглаж header
     * солигдох бүрд дахин холбоно.
     */
    let ro: ResizeObserver | null = null;
    let watched: Element | null = null;

    const attach = () => {
      const el = document.querySelector("header[role='banner']");
      if (!el || el === watched) return;
      ro?.disconnect();
      watched = el;
      ro = new ResizeObserver(() => apply(el));
      ro.observe(el);
      apply(el);
    };

    attach();

    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: false });

    /**
     * `resize` — ResizeObserver-ийн НӨӨЦ зам.
     *
     * RO-гийн callback нь frame-ийн дараа хүргэгддэг тул хуудас
     * КОМПОЗИТ ХИЙГДЭХГҮЙ байх үед (нуугдсан таб/цонх, headless) ХОЙШЛОГДОНО.
     * Тэр үед breakpoint давж header 49↔78px солигдоход `--header-h` хуучин
     * утгаараа үлдэж hero дэлгэцээс зөрдөг. `resize` event нь frame-ээс
     * хамааралгүй тул энэ цоорхойг нөхнө.
     *
     * Хоёулаа зэрэг ажиллана — `apply` нь idempotent (ижил утга дахин бичих
     * нь layout-д нөлөөгүй).
     */
    const onResize = () => {
      const el = document.querySelector("header[role='banner']");
      if (el) apply(el);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      mo.disconnect();
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      root.style.removeProperty("--header-h");
    };
  }, []);

  return null;
}
