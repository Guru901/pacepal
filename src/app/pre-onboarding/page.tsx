"use client";

import useGetUser from "@/hooks/use-get-user";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreOnboarding() {
  const user = useKindeAuth().user;
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const { localUser } = useGetUser();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (localUser?.isOnBoarded) {
          router.push(`/`);
        } else {
          router.push(`/onboarding`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, localUser, router]);

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <div>
      <h1>Redirecting....</h1>
    </div>
  );
}
