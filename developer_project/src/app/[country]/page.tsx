"use client";

import AreaChartComponent from "@/components/AreaChart";
import BarGraph from "@/components/BarGraph";
import NewsList from "@/components/NewsList";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewsItem } from "@/lib/interfaces";
import useCountryStore from "@/store/countryDataStore";
import axios from "axios";
import Bottleneck from "bottleneck";
import { useEffect, useState } from "react";

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

// Fetch data function
const fetchData = async (url: string) => {
  return await limiter.schedule(() => axios.get(url));
};

export default function Page({ params }: { params: { country: string } }) {
  const { country, setIndex, setSymbol, setCountry, symbol } =
    useCountryStore();

  const [error, setError] = useState<string>("");

  const [news, setNews] = useState<NewsItem[]>([]);

  const [countryDetails, setCountryDetails] = useState<{
    ticker: string;
    day_high: number;
    day_low: number;
    name: string;
    country: string;
    yesterday_price: number;
    yearly_per: number;
    monthly_per: number;
    credit_rating?: any[];
  } | null>(null);

  const [chartData, setChartData] = useState<
    {
      category: string;
      export: number;
      import: number;
    }[]
  >([]);

  const [gdpIndexChart, setGdpIndexChart] = useState<
    {
      year: string;
      index: number;
      gdp: number;
    }[]
  >([]);

  const [foreCast, setForeCast] = useState<{ date: string; value: number }[]>(
    []
  );

  useEffect(() => {
    const findIndex = async () => {
      if (country) {
        try {
          console.log("Calling from country page");

          const res = await fetchData(`/api/${encodeURIComponent(country)}`);

          const res_array = res.data;

          console.log(res_array);

          const {
            Name,
            Symbol,
            Country,
            Ticker,
            day_high,
            day_low,
            yesterday,
            YearlyPercentualChange,
            MonthlyPercentualChange,
          } = res_array[0];
          setIndex(Name.toLowerCase());
          setSymbol(Symbol.toLowerCase());

          if (Name === "") {
            setError(Country);
          } else {
            setError("");
            setCountryDetails({
              ticker: Ticker,
              day_high,
              day_low,
              name: Name,
              country: Country,
              monthly_per: MonthlyPercentualChange,
              yearly_per: YearlyPercentualChange,
              yesterday_price: yesterday,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    const c = params.country;
    setCountry(c);
    findIndex();
  }, [country]);

  useEffect(() => {
    const findCreditRating = async () => {
      if (country && countryDetails?.credit_rating === undefined) {
        try {
          const res = await fetchData(
            `/api/credit-rating/${encodeURIComponent(country)}`
          );

          const res_array = res.data;

          setCountryDetails({
            ...countryDetails!,
            credit_rating: res_array,
          });
        } catch (err) {
          console.log(err);
        }
      }
    };

    findCreditRating();
  }, [countryDetails]);

  useEffect(() => {
    const findExportImportData = async () => {
      if (country && chartData.length === 0) {
        try {
          const res = await fetchData(
            `/api/import-export/${encodeURIComponent(country)}`
          );

          const res_array = res.data;

          setChartData(res_array);
        } catch (err) {
          console.log(err);
        }
      }
    };

    findExportImportData();
  }, [countryDetails]);

  useEffect(() => {
    const findGDPvsInd = async () => {
      if (country && gdpIndexChart.length === 0) {
        try {
          const res = await fetchData(
            `/api/gdp-index?index=${symbol}&country=${country}`
          );

          const res_array = res.data;

          setGdpIndexChart(res_array);
        } catch (err) {
          console.log(err);
        }
      }
    };

    findGDPvsInd();
  }, [countryDetails]);

  useEffect(() => {
    const findForeCast = async () => {
      if (country && gdpIndexChart.length === 0) {
        try {
          const res = await fetchData(
            `/api/forecast?symbol=${symbol.toUpperCase()}`
          );

          const res_array = res.data;

          setForeCast(res_array);
        } catch (err) {
          console.log(err);
        }
      }
    };

    findForeCast();
  }, [countryDetails]);

  useEffect(() => {
    const findNews = async () => {
      if (country && news.length === 0) {
        try {
          const res = await fetchData(`/api/news?country=${country}`);

          const res_array = res.data;

          setNews(res_array);
        } catch (err) {
          console.log(err);
        }
      }
    };

    findNews();
  }, [countryDetails]);

  if (error) {
    return (
      <div className="flex justify-center w-full px-24 py-12">
        <span className="text-sm text-gray-400">{error}</span>
      </div>
    );
  }

  if (countryDetails === null) {
    return <div>Loading</div>;
  }
  return (
    <div className="flex flex-col justify-center w-full px-24 py-12 space-y-4">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg">
        <ResizablePanel defaultSize={100}>
          <div className="flex flex-row h-[200px] p-6 justify-between border">
            <div className="flex flex-col">
              <span className="font-bold text-4xl text-primary-te">
                {countryDetails.country}
              </span>
              <span className="font-semibold text-2xl text-background-te">
                Index: {countryDetails.name}
              </span>
              <span className="font-semibold text-2xl text-background-te">
                Ticker: {countryDetails.ticker}
              </span>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={200}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={100}>
              <div className="flex h-full p-6 border justify-between">
                <div className="flex flex-col w-2/3 border-r-2 mr-4">
                  <div>
                    <span className="font-semibold text-lg text-background-te">
                      Index
                    </span>
                  </div>

                  {!countryDetails.credit_rating ? (
                    <span>Could not find index data</span>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day High</TableHead>
                          <TableHead>Day Low</TableHead>
                          <TableHead>Yesterday Price</TableHead>
                          <TableHead>Monthly %</TableHead>
                          <TableHead>Yearly %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{countryDetails.day_high}</TableCell>
                          <TableCell>{countryDetails.day_low}</TableCell>
                          <TableCell>
                            {countryDetails.yesterday_price}
                          </TableCell>
                          <TableCell>{countryDetails.monthly_per}</TableCell>
                          <TableCell>{countryDetails.yearly_per}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}

                  <span className="font-semibold text-lg text-background-te">
                    Forecast
                  </span>
                  {foreCast && foreCast.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {foreCast.map((f, index) => (
                            <TableHead key={index}>{f.date}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          {foreCast.map((f, index) => (
                            <TableCell key={index}>{f.value}</TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </div>
                <div className="flex flex-col w-2/3">
                  <div>
                    <span className="font-semibold text-lg text-background-te">
                      Credit
                    </span>
                  </div>

                  {!countryDetails.credit_rating ? (
                    <span>Could not find credit rating</span>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Agency</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Outlook</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {countryDetails.credit_rating.map((ele) => (
                          <TableRow>
                            <TableCell>{ele.Agency}</TableCell>
                            <TableCell>{ele.Rating}</TableCell>
                            <TableCell>{ele.Outlook}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="flex space-x-4 flex-wrap">
        <BarGraph chartData={chartData} />
        <AreaChartComponent chartData={gdpIndexChart} />
      </div>

      {news.length !== 0 && <NewsList newsData={news} />}
    </div>
  );
}
