"use client";

import clsx from "clsx";
import Image from "next/image";

const PLACEHOLDER_SERVICE = "/img/icons/service-alt.png";
const PLACEHOLDER_RESTAURANT = "/img/icons/restaurant-alt.png";

export interface CategoryFilterPillsCategory {
  id: string;
  name: string;
  /** Category icon; when missing, placeholder is used based on `service` or `defaultPlaceholderService`. */
  iconUrl?: string;
  /** When true, placeholder is service.png; when false, restaurant.png. Used when iconUrl is absent. */
  service?: boolean;
}

export interface CategoryFilterPillsProps {
  categories: CategoryFilterPillsCategory[];
  selectedCategoryIds: string[];
  onCategoryClick: (categoryId: string) => void;
  isLoading?: boolean;
  /** Label for the "all" pill (e.g. "Todos", "All") */
  allLabel?: string;
  /** Shown when loading (e.g. "Loading categories...", "Cargando categorías...") */
  loadingLabel?: string;
  /** Optional wrapper class (e.g. for margin) */
  className?: string;
  /** When category has no iconUrl and no service flag, use service placeholder if true, else restaurant. */
  defaultPlaceholderService?: boolean;
}

function getCategoryIconSrc(
  category: CategoryFilterPillsCategory,
  defaultPlaceholderService: boolean
): string {
  if (category.iconUrl) {
    return category.iconUrl;
  }
  const useService = category.service ?? defaultPlaceholderService;
  return useService ? PLACEHOLDER_SERVICE : PLACEHOLDER_RESTAURANT;
}

export function CategoryFilterPills({
  categories,
  selectedCategoryIds,
  onCategoryClick,
  isLoading = false,
  allLabel = "Todos",
  loadingLabel = "Loading categories...",
  className = "",
  defaultPlaceholderService = false,
}: CategoryFilterPillsProps): React.JSX.Element {
  if (isLoading) {
    return <div className={`px-6 ${className}`.trim()}>{loadingLabel}</div>;
  }

  return (
    <div className={`overflow-x-auto pb-2 scrollbar-hide ${className}`.trim()}>
      <div className="flex gap-3 px-6 min-w-max items-end">
        <button
          key="all"
          onClick={() => onCategoryClick("all")}
          className={clsx(
            "flex flex-col items-center gap-1.5 rounded-xl w-22 px-3 py-3 transition-colors capitalize",
            selectedCategoryIds.length === 0
              ? "bg-primary text-primary-foreground shadow-glow"
              : "bg-card hover:bg-[hsl(var(--primary)_/_0.1)]"
          )}
        >
          <span className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-muted/50">
            <Image
              src={
                defaultPlaceholderService
                  ? PLACEHOLDER_SERVICE
                  : PLACEHOLDER_RESTAURANT
              }
              alt=""
              fill
              className="object-cover"
              sizes="40px"
              unoptimized
            />
          </span>
          <span className="text-xs font-medium leading-tight text-center truncate w-full">
            {allLabel}
          </span>
        </button>
        {categories.map((category) => {
          const isSelected = selectedCategoryIds.includes(category.id);
          const iconSrc = getCategoryIconSrc(
            category,
            defaultPlaceholderService
          );
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryClick(category.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl w-22 px-3 py-3 transition-colors capitalize ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card hover:bg-[hsl(var(--primary)_/_0.1)]"
              }`}
            >
              <span className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-muted/50">
                <Image
                  src={iconSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                  unoptimized
                />
              </span>
              <span className="text-xs font-medium leading-tight text-center truncate w-full">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
