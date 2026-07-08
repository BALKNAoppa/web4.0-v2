import { Breadcrumb, type BreadcrumbItem } from "@/components/layout/breadcrumb";
import { Footer } from "@/components/layout/footer";
import { SupportCategoryDetail } from "@/components/sections/support-category-detail";
import { SupportCenter } from "@/components/sections/support-center";
import { faqCategories, supportCategoryDetails } from "@/data/faq";

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryParam } = await searchParams;
  const category = faqCategories.find((c) => c.id === categoryParam);
  const detail = category ? supportCategoryDetails[category.id] : undefined;

  const breadcrumbItems: BreadcrumbItem[] = category
    ? [{ label: "Тусламж", href: "/support" }, { label: category.label }]
    : [{ label: "Тусламж" }];

  return (
    <main id="main-content" className="bg-background min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      {category && detail ? (
        <SupportCategoryDetail title={category.supportTitle} detail={detail} />
      ) : (
        <SupportCenter />
      )}

      <Footer />
    </main>
  );
}
