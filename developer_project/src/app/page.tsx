"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CountrySearch from "@/components/SelectCountry";
import useCountryStore from "@/store/countryDataStore";

import IndexTable from "@/components/IndexTable";
import Error from "next/error";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Home = () => {
  const { country, setIndex, setSymbol, setCountry } = useCountryStore();
  const router = useRouter();

  const [searchError, setSearchError] = useState<string>("");
  useEffect(() => {
    const findIndex = async () => {
      if (country) {
        console.log("Calling from home page");
        const res = await axios.get(`/api/${encodeURIComponent(country)}`);

        const res_array = res.data;

        const { Name, Symbol, Country } = res_array[0];
        setIndex(Name.toLowerCase());
        setSymbol(Symbol.toLowerCase());
        if (Name === "") {
          setSearchError(Country);
        } else {
          setSearchError("");
          router.push(`/${country}`);
        }
      }
    };
    findIndex();
  }, [country]);

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-8 my-64">
      <div className="w-1/3">
        <div className="flex items-center w-full space-x-4">
          <span className="text-[#1F2937] font-medium text-md text-center w-full">
            Search for the country you want to analyze
          </span>
        </div>

        <div className="mt-8">
          <CountrySearch onCountrySelect={setCountry} />
        </div>
        <span className="text-sm text-gray-400">{searchError}</span>
      </div>
    </div>
  );
};

export default Home;
