import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  const country = params.country;

  const res = await axios.get(
    `${process.env.BASE_URL}/search/${country}?category=index&c=${process.env.KEY}`
  );

  const data = await res.data;

  return Response.json(data);
}
