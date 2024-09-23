import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get("country");

  const res = await axios.get(
    `${process.env.BASE_URL}/news/country/${country}?c=${process.env.KEY}`
  );

  const data = await res.data;

  return Response.json(data);
}
