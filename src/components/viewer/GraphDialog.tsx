"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useMemo } from "react";
import Loading from "../Loading";

interface GraphDialogProps {
  data?: Record<string, number> | null;
  label?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function GraphDialog({
  data: rawData,
  label,
  isOpen,
  onClose,
}: GraphDialogProps) {
  const { data, chartConfig } = useMemo(() => {
    if (!rawData) {
      return { data: null, chartConfig: {} };
    }

    const chartData = Object.entries(rawData).map(([key, value]) => ({
      name: key,
      value: value,
    }));

    const chartConfig = {
      value: {
        label: "Value",
        color: "var(--chart-1)",
      },
    } satisfies ChartConfig;

    return { data: chartData, chartConfig };
  }, [rawData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-4/6 flex flex-col">
        <DialogHeader>
          <DialogTitle>진단 결과 그래프</DialogTitle>
          <DialogDescription>
            AI 모델의 분석 결과를 그래프로 표시합니다.
            {label ? <p>{`결과: ${label}`}</p> : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 w-full h-full">
          {!data ? (
            <div className={"w-full h-full flex justify-center items-center"}>
              <Loading />
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="value" fill="var(--color-value)" radius={4} />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
