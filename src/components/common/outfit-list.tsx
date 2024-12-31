"use client";

import { translations } from "@/i18n";
import { ClothingItem } from "@/lib/clothing-recommendations";
import { IconType } from "react-icons";
import {
  GiWinterHat,
  GiMonclerJacket,
  GiGloves,
  GiTShirt,
  GiSocks,
  GiPoloShirt,
  GiTrousers,
  GiRunningShoe,
  GiHoodie,
  GiSunglasses,
  GiUmbrella,
} from "react-icons/gi";
import { Fragment, useMemo } from "react";

interface OutfitListProps {
  items: ClothingItem[];
  language: string;
}

const itemIcons: Record<string, IconType> = {
  hat: GiWinterHat,
  jacket: GiMonclerJacket,
  gloves: GiGloves,
  scarf: GiWinterHat,
  tshirt: GiTShirt,
  socks: GiSocks,
  shirt: GiPoloShirt,
  pants: GiTrousers,
  shoes: GiRunningShoe,
  sweater: GiHoodie,
  shorts: GiTrousers,
  sunglasses: GiSunglasses,
  umbrella: GiUmbrella,
};

const priorityDots = {
  high: "●",
  medium: "●",
  low: "●",
};

const statusColors = {
  essential: "text-blue-500/80",
  recommended: "text-teal-500/80",
  optional: "text-green-500/80",
};

const getItemStatus = (
  priority: "high" | "medium" | "low",
  isOptional: boolean,
) => {
  if (priority === "high") return "essential";
  if (priority === "medium") return "recommended";
  return "optional";
};

export function OutfitList({ items, language }: OutfitListProps) {
  const t = (key: string) => {
    const parts = key.split(".");
    let current: any = translations[language];
    for (const part of parts) {
      if (!current[part]) return key;
      current = current[part];
    }
    return current;
  };

  // Sort items by priority (high -> medium -> low) and optional status (required first)
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.isOptional !== b.isOptional) {
        return a.isOptional ? 1 : -1;
      }
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="grid gap-8 md:gap-2" key="outfit-list"> 
        {sortedItems.map((item, index) => {
          const Icon = itemIcons[item.type.toLowerCase()] || GiTShirt;
          const status = getItemStatus(item.priority, item.isOptional);

          return (
            <Fragment key={index + 'outfit-item'}>
            <div

              className=" flex-col lg:flex-row flex items-start lg:items-center gap-4 lg:p-4 rounded-lg transition-colors"
            >
              {/* Icon */}
              <div className="p-2 bg-white/10 rounded-xl">
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium text-white">
                    {t(`clothing.${item.type.toLowerCase()}`)}
                  </h5>
                </div>
                <p className="text-sm text-white/60">
                  {(t(`clothingDesc.${item.type.toLowerCase()}`) as string[])?.[0] || item.description}
                </p>
              </div>

              {/* Status label */}
              <div className="text-sm flex text-white/60 bg-white/10 px-4 py-1 rounded-xl">
                <div className={`${statusColors[status]} -translate-x-1`}>
                  {priorityDots[item.priority]}
                </div>
                {t(`clothing.${status}`)}
              </div>
            </div>
            {sortedItems.length - 1 !== index && (
              <div key={index + "separator"} className="h-px w-full bg-white/10 lg:display-none" />
            )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
