import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol");

  const res = await axios.get(
    `${process.env.BASE_URL}/markets/forecasts/symbol/${symbol}?c=${process.env.KEY}`
  );

  const data = await res.data;

  const forecastData = [
    { date: data[0].ForecastDate1, value: data[0].Forecast1 },
    { date: data[0].ForecastDate2, value: data[0].Forecast2 },
    { date: data[0].ForecastDate3, value: data[0].Forecast3 },
    { date: data[0].ForecastDate4, value: data[0].Forecast4 },
  ];

  return Response.json(forecastData);
}
