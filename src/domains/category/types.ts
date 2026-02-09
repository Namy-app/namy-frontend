export interface Category {
  id: string;
  name: string;
  subcategory?: string;
  createdAt: string;
}

export interface CreateCategoryInput {
  name: string;
  subcategory?: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  subcategory?: string;
}

export interface CategoryFiltersInput {
  name?: string;
  subcategory?: string;
}
