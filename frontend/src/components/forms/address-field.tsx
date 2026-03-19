import { useState, useRef, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TOKEN = import.meta.env.VITE_LOCATIONIQ_TOKEN as string;

interface ParsedAddress {
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

interface LocationIQSuggestion {
  place_id: string;
  display_name: string;
  display_place?: string;
  lat: string;
  lon: string;
  address: {
    name?: string;
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country_code?: string;
  };
}

function parsesuggestion(s: LocationIQSuggestion): ParsedAddress {
  const a = s.address;
  const houseNumber = a.house_number ?? "";
  const road = a.road ?? "";

  return {
    line1: [houseNumber, road].filter(Boolean).join(" ") || a.name || "",
    city: a.city ?? a.town ?? a.village ?? a.suburb ?? "",
    province: a.state ?? "",
    postalCode: a.postcode ?? "",
    latitude: parseFloat(s.lat),
    longitude: parseFloat(s.lon),
  };
}

interface AddressAutocompleteFieldProps {
  onAddressSelect: (address: ParsedAddress) => void;
  error?: string;
  required?: boolean;
}

export function AddressAutocompleteField({
  onAddressSelect,
  error,
  required,
}: AddressAutocompleteFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        key: TOKEN,
        q: query,
        limit: "5",
        dedupe: "1",
        countrycodes: "ca", // restrict to Canada
        addressdetails: "1",
        normalizecity: "1",
      });

      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?${params}`
      );

      if (!res.ok) throw new Error("Autocomplete request failed");

      const data: LocationIQSuggestion[] = await res.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
    } catch {
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = (suggestion: LocationIQSuggestion) => {
    setInputValue(suggestion.display_name);
    setIsOpen(false);
    setSuggestions([]);
    onAddressSelect(parsesuggestion(suggestion));
  };

  return (
    <div ref={containerRef} className="space-y-1 relative">
      <Label>
        Address {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Start typing your address…"
          className={error ? "border-destructive" : ""}
          autoComplete="off"
        />
        {isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            Searching…
          </span>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onMouseDown={() => handleSelect(s)} // mousedown fires before input blur
              className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
