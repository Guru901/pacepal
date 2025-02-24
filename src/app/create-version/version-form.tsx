"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { CardContent, CardFooter } from "@/components/ui/card";
import axios from "axios";
import useGetUser from "@/hooks/use-get-user";
import { useRouter } from "next/navigation";
import { useVersionStore } from "@/store/version-store";
import { useUserStore } from "@/store/user-store";
import { scheduleSchema, ScheduleFormData } from "@/lib/schema";

export default function VersionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { localUser } = useGetUser();

  const router = useRouter();

  const { setSelectedVersion } = useVersionStore();
  const { setUser } = useUserStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      versionName: "",
      desiredSleepHours: 8,
      studySlots: [{ name: "", hours: 1 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "studySlots",
  });

  const watchStudySlots = watch("studySlots");

  const totalStudyHours = watchStudySlots.reduce(
    (sum, slot) => sum + (parseFloat(slot.hours?.toString() || "0") || 0),
    0
  );

  const onSubmit = async (formData: ScheduleFormData) => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`/api/add-version`, {
        userId: localUser?.mongoId,
        versionName: formData.versionName,
        desiredSleepHours: formData.desiredSleepHours,
        studySlots: formData.studySlots,
      });
      if (data.success) {
        setSelectedVersion(formData.versionName);
        setUser({
          email: localUser?.email as string,
          id: localUser?.mongoId as string,
          picture: localUser?.picture,
          given_name: localUser?.given_name as string,
          isOnBoarded: true,
          mongoId: localUser?.mongoId as string,
          versions: data.data.versions,
        });
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
    setIsSubmitting(false);
  };
  return (
    <>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="versionName">Version Name</Label>
            <Input
              id="versionName"
              {...register("versionName")}
              placeholder="e.g., Exam Week Schedule"
            />
            {errors.versionName && (
              <p className="text-red-500 text-sm">
                {errors.versionName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="desiredSleepHours">Desired Sleep Hours</Label>
            <Input
              type="number"
              id="desiredSleepHours"
              {...register("desiredSleepHours", { valueAsNumber: true })}
            />
            {errors.desiredSleepHours && (
              <p className="text-red-500 text-sm">
                {errors.desiredSleepHours.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Add Slots</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  {...register(`studySlots.${index}.name`)}
                  placeholder="Slot name"
                  className="flex-grow"
                />
                <Input
                  type="number"
                  step="0.5"
                  {...register(`studySlots.${index}.hours`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Hours"
                  className="w-20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className={`flex-shrink-0 ${
                    fields.length === 1
                      ? "text-gray-400"
                      : "text-red-500 hover:text-red-700"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.studySlots && (
              <p className="text-red-500 text-sm">
                {errors.studySlots.message}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", hours: 1 })}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Study Slot
          </Button>

          <div className="flex justify-between items-center font-semibold">
            <span>Total Study Hours:</span>
            <span>{totalStudyHours}</span>
          </div>
          <div className="flex justify-between items-center font-semibold">
            <span>Total Scheduled Hours (including sleep):</span>
            <span>{totalStudyHours + (watch("desiredSleepHours") || 0)}</span>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Schedule Version"}
        </Button>
      </CardFooter>
    </>
  );
}
