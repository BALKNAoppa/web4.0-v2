"use client";

import { useEffect } from "react";

import { MESSAGES } from "@/messages";
import { SOURCE_LOCALE, useLocale } from "@/lib/locale";

/**
 * ЖИШЭЭ ОРЧУУЛГЫН ХӨДӨЛГҮҮР — DOM-ын бичвэрийг толиор сольдог.
 *
 * ⚠️⚠️ ЭНЭ НЬ ЗОРИУД "ЗӨВ БИШ" ШИЙДЭЛ. Жинхэнэ i18n бол мөр бүрийг кодод
 * `t("key")` болгож, 127 файлыг бүгдийг нь засах ёстой (~2 долоо хоног).
 * Захиалагч 2026-09-15-нд: "sample болохоор үүнээс цаашаа хөгжүүлэгдэхгүй
 * байх … жишээ орчуулга гэдгээрээ танилцуулъя" гэсэн тул ТАНИЛЦУУЛГЫН
 * зорилгод хүрэх ХАМГИЙН БОГИНО зам сонгогдов:
 *   · дата ба компонент БҮХЭЛДЭЭ хөндөгдөхгүй (0 файл засварлагдсан)
 *   · толь нь МОНГОЛ ЭХ БИЧВЭРЭЭР түлхүүрлэгддэг тул шинэ мөр нэмэхэд
 *     зөвхөн `messages/*.ts` дээр нэг мөр нэмнэ
 *   · толинд байхгүй мөр нь МОНГОЛООРОО үлдэнэ (алдаа заахгүй, хоосон
 *     талбай гаргахгүй)
 *
 * ⚠️ ХЯЗГААР (танилцуулгад хэлэх ёстой):
 *   · хэл солиход нэг хором монгол бичвэр анивчина (SSR нь монголоор ирнэ)
 *   · URL хэлээр ялгарахгүй, SEO/hreflang БАЙХГҮЙ
 *   · зөвхөн ЯГ таарсан мөр солигдоно — динамикаар холбогдсон бичвэр
 *     (жишээ нь тоо + үг нийлсэн) орчуулагдахгүй
 * ⇒ Production руу гарах бол ЭНЭ ФАЙЛ ХАЯГДАЖ, `next-intl` + `[locale]`
 *   segment дээр дахин баригдана.
 */

/** Орчуулагдах атрибутууд — дэлгэц уншигч, оролтын сануулга. */
const ATTRS = ["aria-label", "placeholder", "title", "alt"] as const;

/** Анхны монгол утгыг санах — буцаж MN болоход сэргээнэ. */
const originalText = new WeakMap<Text, string>();
const originalAttr = new WeakMap<Element, Map<string, string>>();

function translateTextNode(node: Text, dict: Record<string, string> | null) {
  const original = originalText.get(node) ?? node.nodeValue ?? "";
  const key = original.trim();
  if (!key) return;

  if (!dict) {
    // MN руу буцав — анхны утгыг сэргээнэ
    if (originalText.has(node) && node.nodeValue !== original) node.nodeValue = original;
    return;
  }

  const hit = dict[key];
  if (!hit) return;
  if (!originalText.has(node)) originalText.set(node, original);
  // Эргэн тойрны зай (шинэ мөр, догол) нь layout-д нөлөөлдөг тул ХЭВЭЭР
  const next = original.replace(key, hit);
  if (node.nodeValue !== next) node.nodeValue = next;
}

function translateAttrs(el: Element, dict: Record<string, string> | null) {
  for (const attr of ATTRS) {
    const saved = originalAttr.get(el)?.get(attr);
    const current = el.getAttribute(attr);
    if (current === null && saved === undefined) continue;
    const original = saved ?? current ?? "";
    const key = original.trim();
    if (!key) continue;

    if (!dict) {
      if (saved !== undefined && current !== saved) el.setAttribute(attr, saved);
      continue;
    }
    const hit = dict[key];
    if (!hit) continue;
    if (saved === undefined) {
      const map = originalAttr.get(el) ?? new Map<string, string>();
      map.set(attr, original);
      originalAttr.set(el, map);
    }
    const next = original.replace(key, hit);
    if (current !== next) el.setAttribute(attr, next);
  }
}

/** `<script>`, `<style>` доторх бичвэр нь код — хөндөхгүй. */
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);

function walk(root: Node, dict: Record<string, string> | null) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT;
        // ⚠️ Гарах хаалга: орчуулахыг хүсэхгүй блокт `data-no-translate` тавина
        if (el.hasAttribute("data-no-translate")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null = walker.currentNode;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text, dict);
    else if (node.nodeType === Node.ELEMENT_NODE) translateAttrs(node as Element, dict);
    node = walker.nextNode();
  }
}

export function SampleTranslator() {
  const locale = useLocale();

  useEffect(() => {
    const dict = locale === SOURCE_LOCALE ? null : (MESSAGES[locale] ?? null);

    // ⚠️ `requestAnimationFrame`-ээр багцлав. React нэг үйлдэлд олон зангилаа
    // сольдог; мутаци бүрт бүтэн модыг гүйвэл dropdown нээх бүрт хэдэн зуун
    // удаа ажиллана.
    let queued = false;
    const run = () => {
      queued = false;
      walk(document.body, dict);
    };
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(run);
    };

    run();

    // React дахин зурах, цэс нээгдэх, карусель эргэх бүрт шинэ бичвэр ирнэ
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributeFilter: [...ATTRS],
    });

    return () => observer.disconnect();
  }, [locale]);

  return null;
}
