import Navbar from "@/components/navbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Me from "./me";

export default function MePage() {
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
        <Me />
      </Card>
    </main>
  );
}
