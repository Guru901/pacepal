import { Loader } from "@/components/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { distractionsChartConfig } from "@/lib/chart-configs";
import axios from "axios";
import { useEffect, useState } from "react";
import { LabelList, Pie, PieChart } from "recharts";

function generateColors(count: number) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    const color = `hsl(${hue}, 100%, 70%)`;
    colors.push(color);
  }
  return colors;
}

export function DistractionsChart({
  userId,
  selectedVersion,
}: {
  userId: string;
  selectedVersion: string;
}) {
  const [loading, setLoading] = useState(true);
  const [distractions, setDistractions] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/get-distractions-data?id=${userId}&version=${selectedVersion}`
        );
        if (data.success) {
          const distractionCounts = data.data.distractions.reduce(
            (acc: { [key: string]: number }, distraction: string) => {
              acc[distraction] = (acc[distraction] || 0) + 1;
              return acc;
            },
            {}
          );
          setDistractions(distractionCounts);
        }
      } catch (error) {
        console.error("Error fetching distractions data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, selectedVersion]);

  const dynamicColors = generateColors(Object.keys(distractions).length);

  const chartData = Object.entries(distractions).map(
    ([name, value], index) => ({
      name,
      value,
      fill: dynamicColors[index],
    })
  );

  return (
    <Card className="flex flex-col w-[50vw]">
      {loading ? (
        <Loader />
      ) : (
        <>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Distractions Chart</CardTitle>
              <CardDescription>Shows your distractions</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={distractionsChartConfig}
              className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  <LabelList
                    dataKey="name"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </>
      )}
    </Card>
  );
}
