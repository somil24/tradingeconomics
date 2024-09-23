import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol");
  const d1 = searchParams.get("d1");
  const d2 = searchParams.get("d2");
  const res = await axios.get(
    `${process.env.BASE_URL}/markets/historical/${symbol}?d1=${d1}&d2=${d2}&c=${process.env.KEY}`
  );

  const data = await res.data;

  return Response.json(data);
}
