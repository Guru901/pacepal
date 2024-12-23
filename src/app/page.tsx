"use client";

import { DailyForm } from "@/components/daily-form";
import Navbar from "@/components/navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import useGetUser from "@/hooks/use-get-user";
import { Loader } from "@/components/Loading";
import { SleepChart } from "./(charts)/sleep-chart";
import { TodosChart } from "./(charts)/todos-chart";
import { WorkChart } from "./(charts)/work-chart";
import { MoodChart } from "./(charts)/mood-chart";
import { Penalty } from "./(charts)/penalty";
import { DistractionsChart } from "./(charts)/distractions-chart";

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

  if (loading || !user?.id) return <Loader />;

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
          <div className="flex gap-2">
            <MoodChart userId={String(user?.mongoId)} />
            <Penalty userId={String(user?.mongoId)} />
          </div>
          <DistractionsChart userId={String(user?.mongoId)} />
        </div>
      )}
    </main>
  );
}
