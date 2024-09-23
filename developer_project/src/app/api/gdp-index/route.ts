import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const index = searchParams.get("index");
  const country = searchParams.get("country");

  const d = formatDate(new Date());

  const [indexRes, gdpRes] = await Promise.all([
    axios.get(
      `${process.env.BASE_URL}/markets/historical/${index}?d1=1960-01-01&d2=${d}&c=${process.env.KEY}`
    ),
    axios.get(
      `${process.env.BASE_URL}/historical/country/${country}/indicator/gdp?c=${process.env.KEY}`
    ),
  ]);

  const data = await indexRes.data;

  const index_array = getCloseDataForLastDayOfYear(data);

  const data1 = await gdpRes.data;

  const gdp_index = getYearAndGDPValue(data1);

  const resData = combineIndexAndGdpData(index_array, gdp_index);

  return Response.json(resData);
}

const formatDate = (date: any) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getCloseDataForLastDayOfYear = (data: any[]) => {
  const closeDataByYear: {
    year: number;
    value: number;
  }[] = [];

  const yearlyCloseData = new Map<number, { date: string; value: number }>();

  data.forEach((item: any) => {
    const dateParts = item.Date.split("/");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    const formattedDate = new Date(year, month - 1, day);

    if (yearlyCloseData.has(year)) {
      const existingEntry = yearlyCloseData.get(year)!;
      const existingDate = new Date(existingEntry.date);

      if (formattedDate > existingDate) {
        yearlyCloseData.set(year, { date: item.Date, value: item.Close });
      }
    } else {
      yearlyCloseData.set(year, { date: item.Date, value: item.Close });
    }
  });

  yearlyCloseData.forEach((entry, year) => {
    closeDataByYear.push({
      year: year,
      value: entry.value,
    });
  });

  return closeDataByYear;
};

const getYearAndGDPValue = (data: any) => {
  return data.map((item: any) => {
    const year = new Date(item.DateTime).getFullYear();
    return {
      year: year,
      value: item.Value,
    };
  });
};

const combineIndexAndGdpData = (indexData: any[], gdpData: any[]) => {
  const indexMap = new Map(
    indexData.map((item: any) => [item.year, item.value])
  );
  const gdpMap = new Map(gdpData.map((item: any) => [item.year, item.value]));

  const allYearsSet = new Set<number>();

  let indexKeysIterator = indexMap.keys();
  let indexNext = indexKeysIterator.next();
  while (!indexNext.done) {
    allYearsSet.add(indexNext.value);
    indexNext = indexKeysIterator.next();
  }

  let gdpKeysIterator = gdpMap.keys();
  let gdpNext = gdpKeysIterator.next();
  while (!gdpNext.done) {
    allYearsSet.add(gdpNext.value);
    gdpNext = gdpKeysIterator.next();
  }

  const allYears = Array.from(allYearsSet);

  const combinedData = allYears.map((year) => ({
    year,
    index: indexMap.get(year) || null,
    gdp: gdpMap.get(year) || null,
  }));

  return combinedData;
};
