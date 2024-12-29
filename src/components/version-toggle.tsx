"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetUser from "@/hooks/use-get-user";
import { useVersionStore } from "@/store/version-store";

export function VersionToggle() {
  const { localUser } = useGetUser();
  const { setSelectedVersion } = useVersionStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {localUser?.versions.map((version) => version.versionName)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {localUser?.versions.map((version) => (
          <DropdownMenuItem
            key={version.versionName}
            onClick={() => setSelectedVersion(version.versionName)}
          >
            {version.versionName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
