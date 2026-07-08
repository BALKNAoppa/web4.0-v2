import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export default function UnivisionGoPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Breadcrumb items={[{ label: "Univision Go app" }]} />

      <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
        <h1 className="text-foreground text-center text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          ЭНД UNIVISION GO APP-Н МЭДЭЭЛЭЛ БАЙНА
        </h1>
      </section>

      <Footer />
    </main>
  );
}
