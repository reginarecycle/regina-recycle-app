import { useState, useRef, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TOKEN = import.meta.env.VITE_LOCATIONIQ_TOKEN as string;

const REGINA_VIEWBOX = "-104.73,50.37,-104.40,50.56";

export interface ParsedAddress {
  displayName: string;
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

/** Normalise a Canadian postal code to "A1A 1A1" format, or return empty string. */
function formatCanadianPostal(raw?: string): string {
  if (!raw) return "";
  const clean = raw.replace(/\s+/g, "").toUpperCase();
  if (/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(clean)) {
    return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  }
  // LocationIQ sometimes returns only the FSA (first 3 chars)
  if (/^[A-Z]\d[A-Z]$/.test(clean)) return clean;
  return raw;
}

function parseSuggestion(s: LocationIQSuggestion): ParsedAddress {
  const a = s.address;
  const houseNumber = a.house_number ?? "";
  const road = a.road ?? "";
  // Prefer proper city name; avoid using suburb as city
  const city = a.city ?? a.town ?? a.village ?? "Regina";

  return {
    displayName: s.display_name,
    line1: [houseNumber, road].filter(Boolean).join(" ") || a.name || "",
    city,
    province: a.state ?? "Saskatchewan",
    postalCode: formatCanadianPostal(a.postcode),
    latitude: parseFloat(s.lat),
    longitude: parseFloat(s.lon),
  };
}

interface AddressAutocompleteFieldProps {
  onAddressSelect: (address: ParsedAddress) => void;
  error?: string;
  required?: boolean;
  showLabel?: boolean;
  initialValue?: string;
  /** Restrict results to Regina, Saskatchewan. Defaults to true. */
  restrictToRegina?: boolean;
}

export function AddressAutocompleteField({
  onAddressSelect,
  error,
  required,
  showLabel = true,
  initialValue = "",
  restrictToRegina = true,
}: AddressAutocompleteFieldProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Track whether user has selected from the dropdown
  const selectedRef = useRef(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
        // Append Saskatchewan to bias results even when not bounded
        q: restrictToRegina ? `${query}, Saskatchewan, Canada` : query,
        limit: "6",
        dedupe: "1",
        countrycodes: "ca",
        addressdetails: "1",
        normalizecity: "1",
      });

      if (restrictToRegina) {
        params.set("viewbox", REGINA_VIEWBOX);
        params.set("bounded", "0"); // soft-bound: prefer but don't exclude
      }

      const res = await fetch(`https://api.locationiq.com/v1/autocomplete?${params}`);
      if (!res.ok) throw new Error("Autocomplete request failed");

      let data: LocationIQSuggestion[] = await res.json();

      // Always filter to Saskatchewan
      data = data.filter((s) =>
        s.address.state?.toLowerCase().includes("saskatchewan")
      );

      setSuggestions(data);
      setIsOpen(data.length > 0);
    } catch {
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [restrictToRegina]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    selectedRef.current = false;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = (suggestion: LocationIQSuggestion) => {
    selectedRef.current = true;
    setInputValue(suggestion.display_name);
    setIsOpen(false);
    setSuggestions([]);
    onAddressSelect(parseSuggestion(suggestion));
  };

  // If user typed/browser-autofilled but never picked from dropdown, geocode on blur
  const handleBlur = async () => {
    if (selectedRef.current || inputValue.trim().length < 3) return;

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
      return;
    }

    // Try a one-shot geocode first
    try {
      const params = new URLSearchParams({
        key: TOKEN,
        q: `${inputValue}, Saskatchewan, Canada`,
        limit: "1",
        dedupe: "1",
        countrycodes: "ca",
        addressdetails: "1",
        normalizecity: "1",
      });
      if (restrictToRegina) params.set("viewbox", REGINA_VIEWBOX);

      const res = await fetch(`https://api.locationiq.com/v1/autocomplete?${params}`);
      if (res.ok) {
        const data: LocationIQSuggestion[] = await res.json();
        const sk = data.find((s) => s.address.state?.toLowerCase().includes("saskatchewan"));
        if (sk) {
          selectedRef.current = true;
          setInputValue(sk.display_name);
          setIsOpen(false);
          setSuggestions([]);
          onAddressSelect(parseSuggestion(sk));
          return;
        }
      }
    } catch { /* ignore */ }

    // Geocode failed or no match — accept the raw typed input as-is
    selectedRef.current = true;
    onAddressSelect({
      displayName: inputValue.trim(),
      line1: inputValue.trim(),
      city: "Regina",
      province: "Saskatchewan",
      postalCode: "",
    });
  };

  return (
    <div ref={containerRef} className="space-y-1 relative">
      {showLabel && (
        <Label>
          Address {required && <span className="text-destructive">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={restrictToRegina ? "Search Regina address…" : "Start typing your address…"}
          className={error ? "border-destructive" : ""}
          autoComplete="street-address"
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
              onMouseDown={() => handleSelect(s)}
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
