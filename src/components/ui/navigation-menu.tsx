import * as React from "react"
import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

function NavigationMenu({
  className,
  children,
  viewport = true,
  viewportClassName,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
  /**
   * Viewport-д дамжуулах класс. Viewport нь Root-ийн ДОТОР үүсдэг тул гаднаас
   * шууд хүрэх боломжгүй байсан — mobile header-т full-width / хүрээгүй /
   * header-тэй нийлсэн болгоход шаардлагатай.
   */
  viewportClassName?: string
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
  "group/navigation-menu flex flex-1 items-center justify-start",
  className
)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport className={viewportClassName} />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-0",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted data-open:bg-muted/50 data-open:hover:bg-muted data-open:focus:bg-muted"
)

function NavigationMenuTrigger({
  className,
  children,
  chevron = true,
  unstyled = false,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & {
  /**
   * ChevronDown-ыг харуулах эсэх. Mobile header-т 5 таб нэг мөрөнд багтах ёстой
   * тул 5 chevron (~60px) өргөний нөөцийг бүрэн зарцуулна — тэнд `false`.
   */
  chevron?: boolean
  /**
   * `navigationMenuTriggerStyle()`-ийг ХЭРЭГЛЭХГҮЙ. Тэр style нь `h-9 px-4
   * text-sm` тул mobile-ын 12px / px-0.5 табтай зөрчилддөг.
   */
  unstyled?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(!unstyled && navigationMenuTriggerStyle(), "group", className)}
      onPointerMove={(e) => e.preventDefault()}
      onPointerLeave={(e) => e.preventDefault()}
      {...props}
    >
      {children}
      {chevron && (
        <>
          {" "}
          <ChevronDownIcon className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180" aria-hidden="true" />
        </>
      )}
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      onPointerEnter={(e) => e.preventDefault()}
      onPointerLeave={(e) => e.preventDefault()}
      className={cn(
        // ГУЛСАЛТЫН ЗАЙ: `…-52` (13rem = 208px) байсныг `…-8` (2rem = 32px)
        // болгов. 208px нь агуулгыг дэлгэцийн гадна талаас "шидэж" оруулдаг
        // тул зөөлөн шилжилт биш ҮСРЭЛТ мэт мэдрэгддэг байв. Жижиг зай +
        // fade нь cross-fade шиг тайван харагдана.
        //
        // `duration-500` — `data-motion` анимацид ил тод хугацаа. Өмнө нь
        // зөвхөн `viewport=false` тохиолдолд `duration-300` байсан ба
        // viewport=true (mobile header) үед tw-animate-css-ийн үндсэн
        // 150ms-аар тоглодог тул хэтэрхий шуурхай байв.
        "top-0 left-0 w-full p-2 pr-2.5 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 data-[motion=from-end]:slide-in-from-right-8 data-[motion=from-start]:slide-in-from-left-8 data-[motion=to-end]:slide-out-to-right-8 data-[motion=to-start]:slide-out-to-left-8 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
   <div
  className={cn(
    "absolute top-full left-0 right-0 isolate z-50 flex justify-center"
  )}
>
      {/* `transition-[height]` — Radix нь `--radix-navigation-menu-viewport-height`
          -ийг агуулгын дагуу шинэчилдэг ч transition байхгүй бол өндөр нь
          ҮСРЭНЭ. Ингэснээр НЭГ суурь нь sub menu хооронд зөөлөн "тэнийж"
          агуулга нь хажуугаас гулсаж орж ирнэ (`data-motion` → Content). */}
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          // `duration-500` (өмнө 300) — цэс хооронд шилжихэд өндөр нь агуулгын
          // дагуу тэнийх нь агуулгын 500ms гулсалттай ИЖИЛ хугацаанд явна.
          // Хоёр нь зөрвөл өндөр эрт "суугаад" агуулга нь хоцорч ирнэ.
          "origin-top relative h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 transition-[height,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-1.5 rounded-md p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-sm data-[active=true]:bg-muted/50 data-[active=true]:hover:bg-muted data-[active=true]:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
