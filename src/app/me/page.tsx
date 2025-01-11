"use client";

import { Loader } from "@/components/Loading";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useGetUser from "@/hooks/use-get-user";
import { useUserStore } from "@/store/user-store";
import { useVersionStore } from "@/store/version-store";
import axios from "axios";
import { PencilIcon, SaveIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Me() {
  const [loading, setLoading] = useState(true);
  const [isEditingSleep, setIsEditingSleep] = useState(false);
  const [desiredSleepHours, setDesiredSleepHours] = useState("");

  // New state for slots editing
  const [isEditingSlots, setIsEditingSlots] = useState(false);
  const [editableSlots, setEditableSlots] = useState<
    Array<{ name: string; hours: number }>
  >([]);

  const { localUser } = useGetUser();
  const { setUser } = useUserStore();
  const { selectedVersion } = useVersionStore();

  useEffect(() => {
    if (!localUser?.id) {
      setLoading(true);
      return;
    }

    const hrs = localUser.versions.map((version) => {
      if (version.versionName === selectedVersion) {
        return version.data.desiredSleepHours;
      }
    });

    const slots =
      localUser.versions
        .filter((version) => version.versionName === selectedVersion)
        .map((version) => version.data.slots)[0] || [];

    if (localUser?.id) {
      setLoading(false);
      setDesiredSleepHours(String(hrs));
      setEditableSlots(slots);
    }
  }, [localUser, selectedVersion]);

  useEffect(() => {
    console.log(editableSlots);
  }, [isEditingSlots, editableSlots]);

  const handleSaveSleepHours = async () => {
    try {
      const hours = parseFloat(desiredSleepHours);
      if (isNaN(hours) || hours < 0 || hours > 24) {
        alert("Please enter a valid number of sleep hours (0-24)");
        return;
      }
      const { data } = await axios.post("/api/update-user-sleeping-hrs", {
        id: localUser?.mongoId,
        desiredSleepHours: hours,
        version: selectedVersion,
      });

      if (data.success) {
        setIsEditingSleep(false);
        setUser({
          versions: data.data.versions,
          email: localUser?.email as string,
          id: localUser?.mongoId as string,
          picture: localUser?.picture as string,
          given_name: localUser?.given_name as string,
          isOnBoarded: true,
          mongoId: localUser?.mongoId as string,
        });

        setIsEditingSleep(false);
      }
    } catch (error) {
      console.error("Failed to update sleep hours", error);
      alert("Failed to update sleep hours");
    }
  };
  // New function to handle slot updates
  const handleSaveSlots = async () => {
    try {
      // Validate slots
      const validSlots = editableSlots.filter(
        (slot) =>
          slot.name.trim() !== "" &&
          !isNaN(parseFloat(String(slot.hours))) &&
          parseFloat(String(slot.hours)) >= 0 &&
          parseFloat(String(slot.hours)) <= 24
      );

      if (validSlots.length !== editableSlots.length) {
        alert("Please ensure all slots have a valid name and hours (0-24)");
        return;
      }

      const { data } = await axios.post("/api/update-user-slots", {
        id: localUser?.mongoId,
        slots: validSlots,
        version: selectedVersion,
      });

      if (data.success) {
        setUser({
          versions: data.data.versions,
          email: localUser?.email as string,
          id: localUser?.mongoId as string,
          picture: localUser?.picture as string,
          given_name: localUser?.given_name as string,
          isOnBoarded: true,
          mongoId: localUser?.mongoId as string,
        });

        setIsEditingSlots(false);
        return;
      }
    } catch (error) {
      console.error("Failed to update slots", error);
      alert("Failed to update slots");
    }
  };

  // Function to add a new slot
  const handleAddSlot = () => {
    setEditableSlots([...editableSlots, { name: "", hours: 0 }]);
  };

  // Function to remove a slot
  const handleRemoveSlot = (indexToRemove: number) => {
    setEditableSlots(
      editableSlots.filter((_, index) => index !== indexToRemove)
    );
  };

  // Function to update a specific slot
  const handleUpdateSlot = (index: number, field: string, value: unknown) => {
    const updatedSlots = [...editableSlots];
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value,
    };
    setEditableSlots(updatedSlots);
  };

  if (loading) return <Loader />;

  return (
    <main>
      <Navbar />
      <Card className="flex flex-col w-[80vw] mx-auto gap-2">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Edit Your Info</CardTitle>
            <CardDescription>
              Here you can edit your onboarding info
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex">
          <div className="my-2 flex flex-col items-center w-[25%] border-r">
            <div>
              <Image
                src={String(localUser?.picture)}
                width={208}
                height={208}
                className="rounded-full"
                alt="avatar"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold">
                {localUser?.given_name}
              </h1>
              <p className="text-md text-gray-300">{localUser?.email}</p>
            </div>
          </div>
          <div className="p-4 w-[75%] space-y-4">
            <h1>Edit your info</h1>

            {/* Desired Sleep Hours Section */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <p className="text-md text-zinc-300">
                    Desired Sleeping hours
                  </p>
                  {isEditingSleep ? (
                    <Input
                      type="number"
                      value={desiredSleepHours}
                      onChange={(e) => setDesiredSleepHours(e.target.value)}
                      className="w-20 mr-2"
                      min="0"
                      max="24"
                      step="0.5"
                    />
                  ) : (
                    <p className="text-lg">
                      {
                        localUser?.versions.find(
                          (version) => version.versionName === selectedVersion
                        )?.data.desiredSleepHours
                      }
                    </p>
                  )}
                </div>
                {isEditingSleep ? (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleSaveSleepHours}
                  >
                    <SaveIcon size={15} />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setIsEditingSleep(true)}
                  >
                    <PencilIcon size={15} />
                  </Button>
                )}
              </div>
            </div>

            {/* Slots Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Your Slots</h2>
                {!isEditingSlots ? (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setIsEditingSlots(true)}
                  >
                    <PencilIcon size={15} />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleAddSlot}>
                      Add Slot
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleSaveSlots}
                    >
                      <SaveIcon size={15} />
                    </Button>
                  </div>
                )}
              </div>

              {isEditingSlots ? (
                <div className="space-y-2">
                  {editableSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Slot Name"
                        value={slot.name}
                        onChange={(e) =>
                          handleUpdateSlot(index, "name", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Hours"
                        value={slot.hours}
                        onChange={(e) =>
                          handleUpdateSlot(
                            index,
                            "hours",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-20"
                        min="0"
                        max="24"
                        step="0.5"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleRemoveSlot(index)}
                      >
                        <TrashIcon size={15} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {editableSlots?.map((slot, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{slot.name}</span>
                      <span>{slot.hours} hours</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
