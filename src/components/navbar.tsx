"use client";

import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeAuth,
} from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/user-store";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";

export default function Navbar() {
  const { isAuthenticated } = useKindeAuth();
  const { setUser } = useUserStore();

  return (
    <header className="flex justify-between items-center py-4 px-8">
      <Link className="text-xl" href="/">PacePal</Link>
      <div className="flex gap-4">
        <ModeToggle />
        {isAuthenticated ? (
          <>
            <Link href="/me">
              <Button className="px-6">Profile</Button>
            </Link>
            <LogoutLink>
              <Button
                onClick={() => {
                  setUser({
                    email: "",
                    id: "",
                    picture: "",
                    given_name: "",
                    isOnBoarded: false,
                    desiredSleepHours: 7,
                    mongoId: "",
                    slots: [],
                  });
                }}
                variant={"secondary"}
                className="px-8"
              >
                Logout
              </Button>
            </LogoutLink>
          </>
        ) : (
          <>
            <LoginLink>
              <Button className="px-8">Login</Button>
            </LoginLink>
            <RegisterLink>
              <Button variant={"secondary"} className="px-6">
                Register
              </Button>
            </RegisterLink>
          </>
        )}
      </div>
    </header>
  );
}
