import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useDebounce from "@/app/hooks/debounce";
import { Country } from "@/lib/interfaces";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface CountrySearchProps {
  onCountrySelect: (country: string) => void;
}

const CountrySearch: React.FC<CountrySearchProps> = ({ onCountrySelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (debouncedSearchTerm) {
      axios
        .get(`/api/country-list`)
        .then((response) => {
          const countries: Country[] = response.data;
          const filteredCountries = countries.filter((country) =>
            country.Country.toLowerCase().includes(
              debouncedSearchTerm.toLowerCase()
            )
          );
          setSuggestions(filteredCountries);
        })
        .catch((error) => console.error("Error fetching countries:", error));
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);

  const handleSelectCountry = (country: string) => {
    onCountrySelect(country.toLowerCase());
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="flex w-full max-w-lg justify-center items-center mx-auto space-x-4">
      <div className="flex-col w-full max-w-lg mx-auto ">
        <Input
          type="text"
          placeholder="Search for a country"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ref={inputRef}
        />
        {suggestions.length > 0 &&
          inputRef.current === document.activeElement && (
            <ul className="absolute w-1/3 z-10 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1">
              {suggestions.map((country) => (
                <li
                  key={country.ISO2}
                  onClick={() => setSearchTerm(country.Country)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {country.Country}
                </li>
              ))}
            </ul>
          )}
      </div>

      <Button
        type="button"
        variant={"outline"}
        onClick={() => handleSelectCountry(searchTerm)}
      >
        Search
      </Button>
    </div>
  );
};

export default CountrySearch;
