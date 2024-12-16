"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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
import axios from "axios";
// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ];

const chartConfig = {
  //   visitors: {
  //     label: "Visitors",
  //   },
  happy: {
    label: "Happy",
    color: "hsl(var(--chart-1))",
  },
  tired: {
    label: "Tired",
    color: "hsl(var(--chart-2))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--chart-3))",
  },
  stressed: {
    label: "Stressed",
    color: "hsl(var(--chart-4))",
  },
  productive: {
    label: "Productive",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function MoodChart({ userId }: { userId: string }) {
  const [chartData, setChartData] = useState([
    { mood: "happy", freq: 0, fill: "#FFD700" }, // Example color for "happy"
    { mood: "tired", freq: 0, fill: "#808080" }, // Example color for "tired"
    { mood: "neutral", freq: 0, fill: "#ADD8E6" }, // Example color for "neutral"
    { mood: "stressed", freq: 0, fill: "#FF6347" }, // Example color for "stressed"
    { mood: "productive", freq: 0, fill: "#32CD32" }, // Example color for "productive"
  ]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/get-mood-data?id=${userId}`);

        if (data.success) {
          const moodCounts = {
            happy: 0,
            tired: 0,
            neutral: 0,
            stressed: 0,
            productive: 0,
          };

          // Count the occurrences of each mood
          data.data.forms.forEach((form) => {
            const mood = form.mood;
            if (moodCounts.hasOwnProperty(mood)) {
              moodCounts[mood]++;
            }
          });

          // Update the chart data based on the mood counts
          setChartData((prevData) =>
            prevData.map((item) => ({
              ...item,
              freq: moodCounts[item.mood],
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching mood data:", error);
      }
    })();
  }, [userId]);

  return (
    <Card className="flex flex-col w-[50vw]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="freq" nameKey="mood">
              <LabelList
                dataKey="mood"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
