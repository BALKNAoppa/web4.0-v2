import { groupNavV2, type NavCategory } from "@/data/navigation";
import { type Owner } from "@/lib/brand";

/**
 * Цэсний нэг зүйл = нэг үйлчилгээ. Sample хуудсууд ЭНЭ индексээс уншина —
 * тусад нь контент дата үүсгэхгүй, эс бөгөөс цэс болон хуудас хоёр зөрнө.
 */
export type ServiceEntry = {
  label: string;
  href: string;
  owner: Owner;
  /** Цэсний ангилал — "Internet" */
  category: string;
  /** Багана — "Main packages" (баганагүй категорид байхгүй) */
  column?: string;
  badge?: string;
};

function flatten(categories: NavCategory[]): ServiceEntry[] {
  const out: ServiceEntry[] = [];
  for (const category of categories) {
    const owner = category.owner ?? "self";
    for (const column of category.columns ?? []) {
      for (const item of column.items) {
        out.push({
          label: item.label,
          href: item.href,
          owner: item.owner ?? owner,
          category: category.label,
          column: column.title,
          badge: item.badge,
        });
      }
    }
    for (const item of category.items ?? []) {
      out.push({
        label: item.label,
        href: item.href,
        owner: item.owner ?? owner,
        category: category.label,
        badge: item.badge,
      });
    }
  }
  return out;
}

const ALL = flatten(groupNavV2);
const BY_HREF = new Map(ALL.map((s) => [s.href, s]));

/** Бүтэн зам ("/main-packages?plan=triple") -аар үйлчилгээ олох */
export function findService(href: string): ServiceEntry | null {
  return BY_HREF.get(href) ?? null;
}

/** Мөн баганад байгаа бусад үйлчилгээ — "Холбоотой" блокт харуулна */
export function siblingServices(service: ServiceEntry): ServiceEntry[] {
  return ALL.filter(
    (s) =>
      s.href !== service.href &&
      s.category === service.category &&
      s.column === service.column &&
      s.href !== "#",
  );
}
