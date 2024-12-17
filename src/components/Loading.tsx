import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="w-full h-[40vh] flex items-center justify-center">
      <Loader2 className="animate-spin-css text-gray-400" />
    </div>
  );
}
