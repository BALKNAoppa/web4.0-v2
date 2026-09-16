"use client";

import { useEffect } from "react";

import { MESSAGES } from "@/messages";
import { SOURCE_LOCALE, useLocale } from "@/lib/locale";

const ATTRS = ["aria-label", "placeholder", "title", "alt"] as const;

const originalText = new WeakMap<Text, string>();
const originalAttr = new WeakMap<Element, Map<string, string>>();

function translateTextNode(node: Text, dict: Record<string, string> | null) {
  const original = originalText.get(node) ?? node.nodeValue ?? "";
  const key = original.trim();
  if (!key) return;

  if (!dict) {
    if (originalText.has(node) && node.nodeValue !== original) node.nodeValue = original;
    return;
  }

  const hit = dict[key];
  if (!hit) return;
  if (!originalText.has(node)) originalText.set(node, original);
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

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);

function walk(root: Node, dict: Record<string, string> | null) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT;
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
