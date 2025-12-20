import { PriceRange } from "@/domains/admin/types";

export enum PlaceHolderTypeEnum {
  RESTAURANT = "/img/placeholders/placeholder-restaurant.jpg",
  SHOP = "/img/placeholders/placeholder-shop.jpg",
}

export const PRICE_SYMBOLS = {
  [PriceRange.BUDGET]: "$",
  [PriceRange.MODERATE]: "$$",
  [PriceRange.EXPENSIVE]: "$$$",
  [PriceRange.LUXURY]: "$$$$",
};

export const DAYS_OF_WEEK_BY_INDEX: Record<number, string> = {
  0: "Lunes",
  1: "Martes",
  2: "Miércoles",
  3: "Jueves",
  4: "Viernes",
  5: "Sábado",
  6: "Domingo",
};
