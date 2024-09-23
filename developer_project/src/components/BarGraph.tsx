"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const description = "A multiple bar chart";

const chartConfig = {
  import: {
    label: "Import",
    color: "#2563eb",
  },
  export: {
    label: "Export",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const BarGraph: React.FC<{
  chartData: any;
}> = ({ chartData }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to manage expansion

  if (chartData.length === 0) return <div>Loading data...</div>;

  return (
    <Card className={`${isExpanded ? "w-full" : "w-1/3"} transition-all`}>
      <div className="flex w-full justify-between pr-4 items-center">
        <CardHeader>
          <CardTitle>Export-Import Data</CardTitle>
          <CardDescription>This is a comparison between </CardDescription>
        </CardHeader>

        <Button
          onClick={() => setIsExpanded(!isExpanded)} // Toggle expansion
          className="text-sm bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="import" fill="#2662D9" radius={4} />
            <Bar dataKey="export" fill="#E23670" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarGraph;
