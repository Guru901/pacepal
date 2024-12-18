"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import { Loader } from "@/components/Loading";

const chartConfig = {
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
    { mood: "happy", freq: 0, fill: "#2662D9" }, // Example color for "happy"
    { mood: "tired", freq: 0, fill: "#2EB88A" }, // Example color for "tired"
    { mood: "neutral", freq: 0, fill: "#E88C30" }, // Example color for "neutral"
    { mood: "stressed", freq: 0, fill: "#E23670" }, // Example color for "stressed"
    { mood: "productive", freq: 0, fill: "#E88C30" }, // Example color for "productive"
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
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
          data.data.forms.forEach((form: { mood: string }) => {
            const mood = form.mood;
            if (moodCounts.hasOwnProperty(mood)) {
              // @ts-expect-error - TypeScript doesn't recognize the `hasOwnProperty` method
              moodCounts[mood]++;
            }
          });

          // Update the chart data based on the mood counts
          setChartData((prevData) =>
            prevData.map((item) => ({
              ...item,
              // @ts-expect-error - TypeScript doesn't recognize the `hasOwnProperty` method
              freq: moodCounts[item.mood],
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching mood data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return (
    <Card className="flex flex-col w-[50vw]">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Mood Chart</CardTitle>
          <CardDescription>Shows your mood over time</CardDescription>
        </div>
      </CardHeader>
      {loading ? (
        <Loader />
      ) : (
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
                  fontSize={14}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
