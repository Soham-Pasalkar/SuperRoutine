import rawData from "../../data/supplements.json";

export interface Supplement {
  n: string;
  dose: string;
  time: string;
  does: string;
  form: string;
  look: string;
  ev: string;
  caution: string;
}

export interface PillConfig {
  k: "cap" | "disc" | "caps" | "gel";
  W: number;
  H: number;
  T: number;
  face: string;
  edge: string;
  dots?: number;
}

export interface SupplementsData {
  SUPS: {
    day: Supplement[];
    night: Supplement[];
  };
  PILLS: Record<string, PillConfig>;
}

export const supplementsData = rawData as SupplementsData;
