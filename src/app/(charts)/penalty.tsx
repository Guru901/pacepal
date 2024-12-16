import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

export function Penalty({ userId }: { userId: string }) {
  const [penalty, setPenalty] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/get-penalty?id=${userId}`);

        setPenalty(data.data.penalty);
      } catch (error) {
        console.error(error);
        setPenalty(0);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <Card className="w-[50vw]">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row h-[25%]">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Penalty</CardTitle>
          <CardDescription>
            Keep this money and spend this only on work related stuff
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="w-full h-[75%] flex justify-center items-center">
        <h1 className="text-4xl">{penalty}</h1>
      </CardContent>
    </Card>
  );
}
