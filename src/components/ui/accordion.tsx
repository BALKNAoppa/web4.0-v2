"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-md border border-transparent py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
        {/* ГАНЦ chevron, 180° ЭРГЭНЭ. Өмнө нь доош/дээш хоёр icon байж, задрах
            агшинд АГШИН ЗУУР солигддог байв — өндрийн хөдөлгөөний дунд тэр
            солигдол таслагдсан мэт мэдрэгддэг. Хугацаа, муруй нь
            AccordionContent-ийнхтэй ЯГ ИЖИЛ.
            ⚠️ prefers-reduced-motion үед globals.css:257 бүх transition-ыг
            0.01ms болгодог тул энд тусад нь хамгаалалт хэрэггүй. */}
        <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-aria-expanded/accordion-trigger:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      // ⚠️ `data-[state=open]` — БҮТЭН бичих ЁСТОЙ. Өмнө нь `data-open:` /
      // `data-closed:` гэж байсан бөгөөд Tailwind тэдгээрээс ЯМАР Ч дүрэм
      // үүсгэдэггүй тул `animation-name: none` болж, accordion нь өндрийн
      // хөдөлгөөнгүй ШУУД ҮСЭРЧ нээгддэг байв (CSSOM-оос шалгаж баталсан).
      //
      // `duration-*` ба `ease-*` нь `--tw-duration` / `--tw-ease`-ийг ЭНЭ элемент
      // дээр тавьдаг бөгөөд tw-animate-css-ийн `--animate-accordion-down` тэдгээрийг
      // яг эндээс уншина (анхны утга нь `.2s ease-out`).
      //
      // Муруй нь easeOutCubic. Sheet-ийн `cubic-bezier(.32,.72,0,1)`-ийг ЗОРИУД
      // авалгүй: тэр нь 50% хугацаанд 96% замыг дуусгадаг — бүтэн дэлгэцийн
      // хуудсанд тансаг ч, 90-140px-ийн богино зайд "үсэрчихээд зогсонги"
      // мэт болно. easeOutCubic нь 50%-д ~87% — хөдөлгөөн жигд тархана.
      // ⚠️ Хугацаа, муруй нь AccordionTrigger-ийн chevron-ыхтой ЯГ ИЖИЛ байх
      // ёстой — хоёулаа нэг үйлдлийн хэсэг тул зөрвөл салангид мэдрэгдэнэ.
      className="overflow-hidden text-sm duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pt-0 pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
