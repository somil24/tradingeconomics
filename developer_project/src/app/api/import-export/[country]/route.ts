import { CategoryCount, TradeData } from "@/lib/interfaces";
import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { country: string } }
) {
  const country = params.country;

  const res = await axios.get(
    `${process.env.BASE_URL}/search/${country}?category=comtrade&c=${process.env.KEY}`
  );

  const data = await res.data;

  const cat_data: CategoryCount = countCategories(data);

  const res_array = Object.keys(cat_data).map((ele) => {
    return {
      category: ele,
      import: cat_data[ele].import,
      export: cat_data[ele].export,
    };
  });

  return Response.json(res_array);
}

const countCategories = (data: TradeData[]): CategoryCount => {
  return data.reduce((acc: CategoryCount, item) => {
    const { category, type } = item;

    // Initialize category if not already present
    if (!acc[category]) {
      acc[category] = { import: 0, export: 0 };
    }

    // Increment counts based on type
    if (type === "Import") {
      acc[category].import += 1;
    } else if (type === "Export") {
      acc[category].export += 1;
    }

    return acc;
  }, {});
};
