import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  const country = params.country;

  const res = await axios.get(
    `${process.env.BASE_URL}/credit-ratings/country/${country}?c=${process.env.KEY}`
  );

  const data = await res.data;

  return Response.json(data);
}
