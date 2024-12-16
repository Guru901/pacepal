"use client";

import { DailyForm } from "@/components/daily-form";
import Navbar from "@/components/navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { SleepChart } from "../(charts)/sleep-chart";
import { TodosChart } from "../(charts)/todos-chart";
import { WorkChart } from "../(charts)/work-chart";
import { MoodChart } from "../(charts)/mood-chart";
import useGetUser from "@/hooks/use-get-user";

export default function Dashboard() {
  const { localUser: user } = useGetUser();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  async function isFormSubmittedFetch() {
    try {
      const userID = user?.mongoId.replaceAll(" ", "_");
      setLoading(true);

      if (!userID) return;

      const { data } = await axios.get(`/api/is-form-submitted?id=${userID}`);
      if (data.success) {
        if (data.isFormSubmitted) {
          setIsFormSubmitted(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    (async () => {
      await isFormSubmittedFetch();
    })();
  }, [user?.mongoId]);

  if (loading || !user?.id) return <div>Loading...</div>;

  return (
    <main>
      <Navbar />
      {!isFormSubmitted ? (
        <div>
          <DailyForm hrs={Number(user?.desiredSleepHours)} />
        </div>
      ) : (
        <div className="flex flex-col gap-2 mx-4">
          <SleepChart userId={String(user?.mongoId)} />
          <TodosChart userId={String(user?.mongoId)} />
          <WorkChart userId={String(user?.mongoId)} />
          <MoodChart userId={String(user?.mongoId)} />
        </div>
      )}
    </main>
  );
}
