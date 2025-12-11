import { useState, useRef } from "react";
import { AddressComponent, SelectedPlace } from "../types/address";

export const useAddressAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selected, setSelected] = useState<SelectedPlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const search = async (input: string) => {
    if (!input.trim() || input.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://places.googleapis.com/v1/places:autocomplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask":
              "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat",
          },
          body: JSON.stringify({
            input,
            includedRegionCodes: ["ca"],
          }),
        }
      );

      if (!res.ok) throw new Error("Autocomplete 실패");

      const data = await res.json();
      setSuggestions(
        (data.suggestions || []).filter((s: any) => s.placePrediction)
      );
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaceDetails = async (placeId: string) => {
    setDetailsLoading(true);
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: "GET",
          headers: {
            "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask":
              "id,formattedAddress,location,addressComponents,displayName",
          },
        }
      );

      if (!res.ok) throw new Error("Place Details 실패");

      const data = await res.json();

      let street = "";
      let streetNumber = "";

      const components: AddressComponent = {
        address: "",
        postalCode: "",
        state: "",
        city: "",
        country: "",
        street: "",
        streetNumber: "",
      };

      data.addressComponents?.forEach((comp: any) => {
        if (comp.types.includes("postal_code"))
          components.postalCode = comp.longText;
        if (comp.types.includes("administrative_area_level_1"))
          components.state = comp.longText;
        if (comp.types.includes("locality")) components.city = comp.longText;
        if (comp.types.includes("country")) components.country = comp.longText;
        if (comp.types.includes("route")) {
          street = comp.longText;
          components.street = comp.longText;
        }
        if (comp.types.includes("street_number")) {
          streetNumber = comp.longText;
          components.streetNumber = comp.longText;
        }
      });

      components.address = `${streetNumber} ${street}`.trim();

      setSelected({ placeId: data.id, components });
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (item: any) => {
    const placeId = item.placePrediction.placeId;
    setQuery(item.placePrediction.text.text);
    setSuggestions([]);
    fetchPlaceDetails(placeId);
  };

  const handleEditableChange = (field: string, value: string) => {
    setSelected((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        components: { ...prev.components, [field]: value },
      };
    });
  };

  return {
    query,
    suggestions,
    selected,
    loading,
    detailsLoading,
    handleChange,
    handleSelect,
    handleEditableChange,
    setSelected,
  };
};
