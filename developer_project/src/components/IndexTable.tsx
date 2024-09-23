import React, { useState, useEffect } from "react";
import axios from "axios";
import useCountryStore from "@/store/countryDataStore";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface HistoricalData {
  Date: string;
  Close: number;
}

const IndexTable: React.FC = () => {
  const { symbol, index } = useCountryStore();
  const [startYear, setStartYear] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);
  const [indexData, setIndexData] = useState<HistoricalData[]>([]);
  const [yearlyAverages, setYearlyAverages] = useState<any[]>([]);
  const [cagr, setCagr] = useState<number | null>(null);

  // Fetch historical data based on the selected year range
  const fetchHistoricalData = async () => {
    if (startYear && endYear) {
      const d1 = `${startYear}-01-01`;
      const d2 = `${endYear}-12-31`;

      try {
        const response = await axios.get(
          `/api/index-data?symbol=${symbol}&d1=${d1}&d2=${d2}`
        );
        const data = response.data;
        setIndexData(data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    }
  };

  // Calculate average yearly index and CAGR
  const calculateYearlyAveragesAndCAGR = () => {
    if (indexData.length > 0) {
      const groupedData: { [year: string]: number[] } = {};

      // Group the data by year and accumulate Close prices
      indexData.forEach((entry) => {
        const year = new Date(entry.Date).getFullYear().toString();
        if (!groupedData[year]) {
          groupedData[year] = [];
        }
        groupedData[year].push(entry.Close);
      });

      // Calculate the yearly average for each year
      const averages = Object.keys(groupedData).map((year) => {
        const total = groupedData[year].reduce((sum, close) => sum + close, 0);
        const avg = total / groupedData[year].length;
        return { year, average: avg.toFixed(2) };
      });

      setYearlyAverages(averages);

      // Calculate CAGR
      const startValue = averages[0]?.average;
      const endValue = averages[averages.length - 1]?.average;

      if (startValue && endValue && startYear && endYear) {
        const years = endYear - startYear;
        const calculatedCAGR = (
          (Math.pow(Number(endValue) / Number(startValue), 1 / years) - 1) *
          100
        ).toFixed(2);
        setCagr(Number(calculatedCAGR));
      }
    }
  };

  // Fetch data when year range is updated
  useEffect(() => {
    fetchHistoricalData();
  }, [startYear, endYear]);

  // Calculate averages and CAGR when data is available
  useEffect(() => {
    calculateYearlyAveragesAndCAGR();
  }, [indexData]);

  return (
    <div className="p-6">
      <div className="mb-4">
        <label className="mr-4">Start Year: </label>
        <Input
          type="number"
          value={startYear ?? ""}
          onChange={(e) => setStartYear(Number(e.target.value))}
          className="border rounded px-2 py-1"
        />
        <label className="ml-4 mr-4">End Year: </label>
        <Input
          type="number"
          value={endYear ?? ""}
          onChange={(e) => setEndYear(Number(e.target.value))}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="mb-4">
        <Button
          onClick={fetchHistoricalData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Data
        </Button>
      </div>

      {yearlyAverages.length > 0 && (
        <>
          <Table>
            <TableCaption>{index.toUpperCase()} Average Growth</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Year</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearlyAverages.map((item) => (
                <TableRow key={item.year}>
                  <TableCell className="border border-gray-300 px-4 py-2">
                    {item.year}
                  </TableCell>
                  <TableCell className="border border-gray-300 px-4 py-2">
                    {item.average}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {cagr && (
            <div className="mt-4">
              <p>
                <strong>CAGR:</strong> {cagr}%
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IndexTable;
