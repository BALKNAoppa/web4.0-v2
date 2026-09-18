import type { PlanId } from "./main-packages-quiz";

export type PlanFeature = {
  label: string;
  value: string;
};

export type PlanGroup = {
  icon: "wifi" | "tv" | "play" | "phone";
  title: string;
  features: PlanFeature[];
};

export type Plan = {
  id: PlanId;
  name: string;
  recommended?: boolean;
  price: string;
  groups: PlanGroup[];
  detailHref: string;
};

export const plans: Plan[] = [
  {
    id: "m-plus",
    name: "M+",
    price: "54'900₮",
    detailHref: "#",
    groups: [
      {
        icon: "wifi",
        title: "Интернэт",
        features: [
          { label: "Үндсэн хурд", value: "50Mbps* хүртэл" },
          { label: "Дата эрх", value: "800GB" },
        ],
      },
      {
        icon: "tv",
        title: "IPTV",
        features: [
          { label: "ТВ суваг", value: "80+" },
          { label: "Кино эрх", value: "8 BOX-гүй" },
          { label: "Кино багц", value: "Холливуд" },
        ],
      },
      {
        icon: "phone",
        title: "Суурин утас",
        features: [{ label: "77-той дугаарт", value: "Хязгааргүй" }],
      },
    ],
  },

  {
    id: "l-plus",
    name: "L+",
    recommended: true,
    price: "79'900₮",
    detailHref: "#",
    groups: [
      {
        icon: "wifi",
        title: "Интернэт",
        features: [
          { label: "Үндсэн хурд", value: "100Mbps* хүртэл" },
          { label: "Дата эрх", value: "1 TB" },
        ],
      },
      {
        icon: "tv",
        title: "IPTV",
        features: [
          { label: "ТВ суваг", value: "120+" },
          { label: "Кино эрх", value: "20 BOX-гүй" },
          { label: "Кино багц", value: "Холливуд, Ази" },
        ],
      },
      {
        icon: "play",
        title: "Энтертайнмент",
        features: [{ label: "HBO Max", value: "Standard" }],
      },
      {
        icon: "phone",
        title: "Суурин утас",
        features: [{ label: "77-той дугаарт", value: "Хязгааргүй" }],
      },
    ],
  },

  {
    id: "xl-plus",
    name: "XL+",
    price: "99'900₮",
    detailHref: "#",
    groups: [
      {
        icon: "wifi",
        title: "Интернэт",
        features: [
          { label: "Үндсэн хурд", value: "200Mbps* хүртэл" },
          { label: "Дата эрх", value: "1.5 TB" },
        ],
      },
      {
        icon: "tv",
        title: "IPTV",
        features: [
          { label: "ТВ суваг", value: "160+" },
          { label: "Кино эрх", value: "100+ BOX-гүй" },
          { label: "Кино багц", value: "Холливуд, Ази, Монгол" },
        ],
      },
      {
        icon: "play",
        title: "Энтертайнмент",
        features: [{ label: "HBO Max", value: "Standard" }],
      },
      {
        icon: "phone",
        title: "Суурин утас",
        features: [{ label: "77-той дугаарт", value: "Хязгааргүй" }],
      },
    ],
  },
];
