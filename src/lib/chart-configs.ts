import { ChartConfig } from "@/components/ui/chart";

export const moodCharConfig = {
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
    color: "hsl(var(--chart-5))",
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

export const distractionsChartConfig = {
  chart: {
    theme: {
      light: "transparent",
      dark: "transparent",
    },
  },
  text: {
    theme: {
      light: "currentColor",
      dark: "currentColor",
    },
  },
  path: {
    theme: {
      light: "currentColor",
      dark: "currentColor",
    },
  },
} satisfies ChartConfig;

export const productivityChartConfig = {
  views: {
    label: "Productivity Rating",
  },
  productivity: {
    label: "Productivity",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const sleepChartConfig = {
  actual_sleeping_hrs: {
    label: "Actual Sleeping Hrs",
    color: "hsl(var(--chart-5))",
  },
  desired_sleep_hrs: {
    label: "Desired Sleep Hrs",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const todosChartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-5))",
  },
  planned: {
    label: "Planned",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export const workChartConfig = {
  actual_working_hrs: {
    label: "Actual Working Hrs",
    color: "hsl(var(--chart-5))",
  },
  desired_working_hrs: {
    label: "Desired Working Hrs",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
