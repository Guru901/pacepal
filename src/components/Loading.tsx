import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="w-full h-[] flex items-center justify-center">
      <Loader2 className="animate-spin-css" />
    </div>
  );
}
