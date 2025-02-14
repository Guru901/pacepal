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
import { PencilIcon } from "lucide-react";
import Link from "next/link";

export function VersionToggle() {
  const { localUser } = useGetUser();
  const { setSelectedVersion, selectedVersion } = useVersionStore();

  function changeVersion(version: string) {
    localStorage.setItem("selected-version", version);
    setSelectedVersion(version);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {selectedVersion}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {localUser?.versions.map((version) => (
          <DropdownMenuItem
            key={version.versionName}
            onClick={() => {
              changeVersion(version.versionName);
            }}
          >
            {version.versionName}
          </DropdownMenuItem>
        ))}
        <Link href={"/create-version"}>
          <DropdownMenuItem>
            <PencilIcon /> Add new
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
