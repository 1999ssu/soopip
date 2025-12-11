import { AddressComponent, SelectedPlace } from "../types/types";

export const fetchAutocomplete = async (input: string) => {
  if (!input.trim() || input.length < 2) return [];

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
      body: JSON.stringify({ input, includedRegionCodes: ["ca"] }),
    }
  );

  if (!res.ok) throw new Error("Autocomplete 실패");
  const data = await res.json();
  return (data.suggestions || []).filter((s: any) => s.placePrediction);
};

export const fetchPlaceDetails = async (
  placeId: string
): Promise<SelectedPlace> => {
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

  const components: AddressComponent =
    data.addressComponents?.reduce((acc: any, comp: any) => {
      comp.types.forEach((type: string) => {
        if (type === "postal_code") acc.postalCode = comp.longText;
        if (type === "administrative_area_level_1") acc.state = comp.longText;
        if (type === "locality") acc.city = comp.longText;
        if (type === "administrative_area_level_2") acc.county = comp.longText;
        if (type === "country") acc.country = comp.longText;
        if (type === "route") acc.street = comp.longText;
        if (type === "street_number") acc.streetNumber = comp.longText;
      });
      return acc;
    }, {}) || {};

  return {
    placeId: data.id,
    formattedAddress: data.formattedAddress,
    lat: data.location.latitude,
    lng: data.location.longitude,
    components,
  };
};
