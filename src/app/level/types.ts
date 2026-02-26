export interface LevelProgress {
  current: number;
  total: number;
  from: number;
  to: number;
}

export interface Level {
  id: number;
  gemIcon: string;
  name: string;
  subtitle: string;
  discount: string;
  daysLabel: string;
  borderColor: string;
  shadowColor: string;
  discountColor: string;
  progress: LevelProgress | null; // null = max level or premium
  maxLabel: string | null; // e.g. "Nivel Maximo" | "Estado Premium"
  downgradeNote: string | null;
  streak: number;
  benefitsTitle: string;
  benefits: string[];
}
