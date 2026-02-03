"use client";

import { type Libraries, LoadScript } from "@react-google-maps/api";
import { type ReactNode } from "react";

import { env } from "@/lib/env";

const libraries: Libraries = ["places"];

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  return (
    <LoadScript
      googleMapsApiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
}
