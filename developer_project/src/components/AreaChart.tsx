"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
import { useState } from "react";
import { Button } from "./ui/button";

export const description = "An area chart with gradient fill";

const chartConfig = {
  index: {
    label: "Index",
    color: "#2563eb",
  },
  gdp: {
    label: "GDP",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const AreaChartComponent: React.FC<{
  chartData: any;
}> = ({ chartData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const reversedChartData = [...chartData].reverse();
  if (chartData.length === 0) return <div>Loading data...</div>;
  return (
    <Card className={`${isExpanded ? "w-full" : "w-1/3"} transition-all`}>
      <div className="flex w-full justify-between pr-4 items-center">
        <CardHeader>
          <CardTitle>Index vs GDP</CardTitle>
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
          <AreaChart
            accessibilityLayer
            data={reversedChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                console.log(value);

                return value === null ? "N/A" : value;
              }}
              direction={""}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E23670" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#E23670" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2662D9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2662D9" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="index"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="#2662D9"
              stackId="a"
            />
            <Area
              dataKey="gdp"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="#E23670"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChartComponent;
