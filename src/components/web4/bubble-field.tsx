/**
 * Bubble background — бүх хуудсыг (background canvas) дүүргэсэн нэг давхарга.
 * Desktop дэлгэц нь энэ canvas-ийн зөвхөн хэсгийг харуулна; ирмэг дэх bubble-ууд
 * дэлгэцийн зүүн/баруун захаас хагас гарч (bleed) харагдана, төвийнх бүтэн.
 *
 * Байршил нь хэрэглэгчийн зурсан layout-ыг дагасан: top% = хуудасны гүн,
 * left/right сөрөг vw = дэлгэцийн захаас гарах.
 */

type Bubble = {
  top: string;
  left?: string;
  right?: string;
  size: string;
  opacity: number;
};

const BUBBLES: Bubble[] = [
  { top: "0%", right: "-11vw", size: "62vmin", opacity: 0.85 }, // hero — баруун дээд
  { top: "3%", left: "-13vw", size: "56vmin", opacity: 0.82 }, // hero — зүүн дээд (нэмсэн)
  { top: "14%", left: "-13vw", size: "52vmin", opacity: 0.8 }, // questions — зүүн
  { top: "15%", right: "-11vw", size: "46vmin", opacity: 0.8 }, // questions — баруун доод (нэмсэн)
  { top: "42%", right: "-12vw", size: "56vmin", opacity: 0.8 }, // brand — баруун
  { top: "74%", right: "-13vw", size: "62vmin", opacity: 0.8 }, // solution — баруун
  { top: "88%", left: "-12vw", size: "50vmin", opacity: 0.78 }, // swot — зүүн доод
];

export function BubbleField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className="absolute bg-contain bg-center bg-no-repeat"
          style={{
            top: b.top,
            left: b.left,
            right: b.right,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            backgroundImage: "url('/bubble.png')",
          }}
        />
      ))}
    </div>
  );
}
