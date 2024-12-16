"use client";

import React, { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const chartConfig = {
  actual_working_hrs: {
    label: "Actual Working Hrs",
    color: "hsl(var(--chart-5))",
  },
  desired_working_hrs: {
    label: "Desired Working Hrs",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function WorkChart({ userId }: { userId: string }) {
  const [desiredWorkHrs, setDesiredWorkHrs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/get-work-data?id=${userId}&range=${timeRange}`
        );

        if (data.success) {
          // Get desired working hours dynamically
          const desiredHours = data.data.desiredWorkingHours;
          setDesiredWorkHrs(desiredHours);

          // Create the final chart data
          const combinedChartData = data.data.forms.map(
            (form: {
              hoursPlanned: number;
              hoursWorked: { name: string; hours: number }[];
              createdAt: string;
            }) => {
              const date = new Date(form.createdAt).toLocaleDateString("en-US");
              const dataForDate = { date };

              // Normalize period names (handle variations)

              // For each time period, set the actual and desired hours
              form.hoursWorked.forEach((entry) => {
                // Normalize the period name
                const periodName = entry.name;

                const desiredPeriod = desiredHours.find(
                  // @ts-expect-error FIXME
                  (d) => d.name.toLowerCase() === periodName.toLowerCase()
                );

                if (desiredPeriod) {
                  // @ts-expect-error FIXME
                  dataForDate[periodName] = {
                    actual_working_hrs: entry.hours,
                    desired_working_hrs: desiredPeriod.hours,
                  };
                }
              });

              return dataForDate;
            }
          );

          setChartData(combinedChartData);
        }
      } catch (error) {
        console.error("Error fetching work data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkData();
  }, [userId, timeRange]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <p>Loading work hours data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Hours Charts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {desiredWorkHrs.map((item: { name: string; hours: number }) => (
            <Card key={item.name} className="m-2">
              <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                  <CardTitle>{item.name} Hours Chart</CardTitle>
                  <CardDescription>
                    Showing Working hours for the selected time range
                  </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger
                    className="w-[160px] rounded-lg sm:ml-auto"
                    aria-label="Select a value"
                  >
                    <SelectValue placeholder="Last 30 days" />
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
              </CardHeader>
              <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {chartData.length > 0 ? (
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="fillActualWorkingHrs"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-actual_working_hrs)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-actual_working_hrs)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="fillDesiredWorkingHrs"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-desired_working_hrs)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-desired_working_hrs)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              );
                            }}
                            indicator="dot"
                          />
                        }
                      />
                      <Area
                        dataKey={(entry) =>
                          entry[item.name]?.actual_working_hrs
                        }
                        name="Actual Working Hours"
                        type="natural"
                        fill="url(#fillActualWorkingHrs)"
                        stroke="var(--color-actual_working_hrs)"
                      />
                      <Area
                        dataKey={(entry) =>
                          entry[item.name]?.desired_working_hrs
                        }
                        name="Desired Working Hours"
                        type="natural"
                        fill="url(#fillDesiredWorkingHrs)"
                        stroke="var(--color-desired_working_hrs)"
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No data available for {item.name}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}