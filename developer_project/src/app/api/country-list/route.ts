import axios from "axios";

export async function GET() {
  const res = await axios.get(
    `${process.env.BASE_URL}/country?c=${process.env.KEY}`
  );

  const data = await res.data;

  return Response.json(data);
}
