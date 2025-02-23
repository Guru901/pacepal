import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/Loading";
import { todosChartConfig } from "@/lib/chart-configs";

type TodoData = {
  createdAt?: string;
  tasksPlanned: number;
  tasksCompleted: number;
};

type ChartData = {
  date: string;
  tasksCompleted: number;
  tasksPlanned: number;
};

export function TodosChart({
  userId,
  selectedVersion,
}: {
  userId: string;
  selectedVersion: string;
}) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  const filterDataByTimeRange = (
    data: TodoData[],
    range: string
  ): TodoData[] => {
    const now = new Date();
    const startDate = new Date();

    if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
    } else if (range === "90d") {
      startDate.setDate(now.getDate() - 90);
    }

    return data.filter((item) => {
      if (!item.createdAt) return false;
      const itemDate = new Date(item.createdAt);
      return itemDate >= startDate && itemDate <= now;
    });
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/get-todos-data?id=${userId}&version=${selectedVersion}`
        );
        if (data.success) {
          const formattedData = data.data.todos.map((item: TodoData) => ({
            createdAt: item.createdAt,
            tasksPlanned: item.tasksPlanned,
            tasksCompleted: item.tasksCompleted,
          }));

          const filteredData = filterDataByTimeRange(formattedData, timeRange);

          const transformedData: ChartData[] = filteredData.map(
            (item: {
              createdAt?: string;
              tasksPlanned: number;
              tasksCompleted: number;
            }) => ({
              date: new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "2-digit",
              }).format(new Date(item.createdAt!)),
              tasksPlanned: item.tasksPlanned,
              tasksCompleted: item.tasksCompleted,
            })
          );

          setChartData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching todos data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, timeRange, selectedVersion]);

  if (loading) return <Loader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>

        <ChartContainer config={todosChartConfig} className="h-[50vh] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="tasksCompleted"
              fill="var(--color-completed)"
              radius={10}
            />
            <Bar
              dataKey="tasksPlanned"
              fill="var(--color-planned)"
              radius={10}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
