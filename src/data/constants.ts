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
