import Image from "next/image";
import Link from "next/link";

import { tvodPackages, type TvodPackage } from "@/data/tvod-packages";

/**
 * Энэ компонент outer section/container оруулдаггүй — tab панелийн дотор оруулахаар
 * бэлдсэн. Эцэг компонент (TvodCatalog) container/padding-ийг хариуцна.
 */
export function TvodPackages() {
  return (
    <div aria-labelledby="tvod-packages-title">
      <div className="mb-10">
        <h2 id="tvod-packages-title" className="text-2xl font-bold tracking-tight md:text-3xl">
          Онцлох багцууд
        </h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base">
          Тус бүрийн төрөлд тохирсон кинонуудыг нэг багцаар түрээслэх боломжтой.
        </p>
      </div>

      <div className="space-y-12 lg:space-y-16">
        {tvodPackages.map((pkg, index) => (
          <PackageRow key={pkg.id} pkg={pkg} reversed={index % 2 === 1} />
        ))}
      </div>
    </div>
  );
}

function PackageRow({ pkg, reversed }: { pkg: TvodPackage; reversed: boolean }) {
  return (
    <article
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
        reversed ? "lg:[&>div:first-child]:order-2" : ""
      }`}
      aria-labelledby={`pkg-${pkg.id}-title`}
    >
      <PackageCover name={pkg.name} cover={pkg.cover} />

      <div>
        <h3
          id={`pkg-${pkg.id}-title`}
          className="text-foreground text-xl font-bold tracking-wider uppercase md:text-2xl"
        >
          {pkg.name}
        </h3>
        <p className="text-muted-foreground mt-4 text-sm leading-relaxed md:text-base">
          {pkg.description}
        </p>

        <p className="text-muted-foreground/60 mt-8 text-center text-lg tracking-wider uppercase md:text-xl">
          Багцын кинонууд
        </p>

        <div className="mt-6 flex justify-center lg:justify-start">
          <Link
            href={pkg.detailHref}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary inline-flex h-11 items-center justify-center rounded-md px-8 text-sm font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Дэлгэрэнгүй
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Багцын cover image — зураг тавьсан үед Image, байхгүй үед placeholder.
 * Доод-зүүн буланд багцын нэр label-аар харагдана.
 */
function PackageCover({ name, cover }: { name: string; cover?: string }) {
  return (
    <div className="bg-muted border-border relative h-70 overflow-hidden rounded-2xl border md:h-85">
      {cover ? (
        <Image
          src={cover}
          alt={name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <span className="text-muted-foreground/40 text-3xl font-bold md:text-5xl">{name}</span>
        </div>
      )}
      {/* Доороос дээш бараан gradient — текст уншигдахуйц */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute right-4 bottom-3 left-4">
        <span className="text-base font-bold tracking-wider text-white uppercase drop-shadow-md">
          {name}
        </span>
      </div>
    </div>
  );
}
