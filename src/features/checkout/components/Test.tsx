// components/Test.tsx
import React, { useState, useRef } from "react";
// TODO :: 호현 작업
// 키 구글에서 바꾸고 Env에서 불러오는 형식으로 변경 필요
const API_KEY = "AIzaSyAhsfaijT7SxCFzFEYHdoIA4Vk1hmlAiwc"; // .env로 옮기세요

interface AddressComponent {
  postalCode?: string;
  state?: string;
  city?: string;
  county?: string;
  country?: string;
  street?: string;
  streetNumber?: string;
}

interface SelectedPlace {
  placeId: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  components: AddressComponent;
}

const Test: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selected, setSelected] = useState<SelectedPlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Autocomplete (New) 검색
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
            "X-Goog-Api-Key": API_KEY,
            "X-Goog-FieldMask":
              "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat",
          },
          body: JSON.stringify({
            input,
            includedRegionCodes: ["us", "ca"],
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

  // 2. Place Details (New) 호출 → Zip Code, State, City 등 추출
  const fetchPlaceDetails = async (placeId: string) => {
    setDetailsLoading(true);
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: "GET",
          headers: {
            "X-Goog-Api-Key": API_KEY,
            // 필요한 필드만 요청 (비용 절감 + 속도 향상)
            "X-Goog-FieldMask":
              "id,formattedAddress,location,addressComponents,displayName",
          },
        }
      );

      if (!res.ok) throw new Error("Place Details 실패");

      const data = await res.json();

      // addressComponents에서 필요한 정보 추출
      const components =
        data.addressComponents?.reduce((acc: any, comp: any) => {
          comp.types.forEach((type: string) => {
            if (type === "postal_code") acc.postalCode = comp.longText;
            if (type === "administrative_area_level_1")
              acc.state = comp.longText;
            if (type === "locality") acc.city = comp.longText;
            if (type === "administrative_area_level_2")
              acc.county = comp.longText;
            if (type === "country") acc.country = comp.longText;
            if (type === "route") acc.street = comp.longText;
            if (type === "street_number") acc.streetNumber = comp.longText;
          });
          return acc;
        }, {}) || {};

      setSelected({
        placeId: data.id,
        formattedAddress: data.formattedAddress,
        lat: data.location.latitude,
        lng: data.location.longitude,
        components,
      });
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
    const text = item.placePrediction.text.text;
    setQuery(text);
    setSuggestions([]);
    fetchPlaceDetails(placeId); // 여기서 상세 정보 가져옴!
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "640px",
        margin: "0 auto",
        fontFamily: "system-ui",
      }}
    >
      <h2 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "600" }}>
        Find a store
      </h2>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter city, postal code or address"
          style={{
            width: "100%",
            padding: "16px 20px",
            fontSize: "18px",
            border: "2px solid #e0e0e0",
            borderRadius: "12px",
            outline: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#0066cc")}
          onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
        />

        {loading && (
          <div style={{ position: "absolute", right: "16px", top: "18px" }}>
            검색 중...
          </div>
        )}

        {suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "12px",
              marginTop: "8px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              zIndex: 1000,
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {suggestions.map((item, i) => (
              <div
                key={i}
                onClick={() => handleSelect(item)}
                style={{
                  padding: "14px 20px",
                  cursor: "pointer",
                  borderBottom:
                    i < suggestions.length - 1 ? "1px solid #eee" : "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                <div style={{ fontWeight: 600 }}>
                  {item.placePrediction.structuredFormat?.mainText?.text ||
                    item.placePrediction.text.text}
                </div>
                <div
                  style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}
                >
                  {item.placePrediction.structuredFormat?.secondaryText?.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 선택된 주소 상세 정보 */}
      {detailsLoading && (
        <p style={{ marginTop: "20px" }}>주소 정보를 가져오는 중...</p>
      )}

      {selected && (
        <div
          style={{
            marginTop: "40px",
            padding: "28px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", fontSize: "22px" }}>
            선택된 주소 정보
          </h3>

          <div style={{ lineHeight: "2" }}>
            <p>
              <strong>전체 주소:</strong> {selected.formattedAddress}
            </p>
            <p>
              <strong>우편번호:</strong> {selected.components.postalCode || "—"}
            </p>
            <p>
              <strong>시/도 (State):</strong> {selected.components.state || "—"}
            </p>
            <p>
              <strong>도시 (City):</strong> {selected.components.city || "—"}
            </p>
            <p>
              <strong>카운티:</strong> {selected.components.county || "—"}
            </p>
            <p>
              <strong>위도:</strong> {selected.lat.toFixed(6)}
            </p>
            <p>
              <strong>경도:</strong> {selected.lng.toFixed(6)}
            </p>
            <p>
              <strong>Place ID:</strong>{" "}
              <code
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {selected.placeId}
              </code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
