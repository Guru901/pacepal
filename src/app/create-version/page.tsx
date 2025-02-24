import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import VersionForm from "./version-form";

export default function ScheduleVersionCreator() {
  return (
    <main className="flex flex-col gap-10">
      <Navbar />
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create New Schedule Version
          </CardTitle>
        </CardHeader>
        <VersionForm />
      </Card>
    </main>
  );
}
