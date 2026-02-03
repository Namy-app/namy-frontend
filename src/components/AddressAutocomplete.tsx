"use client";

import { Autocomplete } from "@react-google-maps/api";
import { useRef, useState } from "react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (
    address: string,
    placeId: string | null,
    lat: number | null,
    lng: number | null
  ) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Search for an address...",
  required = false,
  className = "",
}: AddressAutocompleteProps) {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      const address = place.formatted_address || "";
      const placeId = place.place_id || null;
      const lat = place.geometry?.location?.lat() || null;
      const lng = place.geometry?.location?.lng() || null;

      onChange(address, placeId, lat, lng);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow manual typing, but clear placeId since it's not from autocomplete
    onChange(e.target.value, null, null, null);
  };

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      options={{
        componentRestrictions: { country: "mx" }, // Restrict to Mexico
        types: ["address"],
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      />
    </Autocomplete>
  );
}
