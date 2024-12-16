"use client";

import { useUserStore } from "@/store/user-store";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import { useState, useEffect } from "react";

export default function useGetUser() {
  const { user: localUser, setUser } = useUserStore();
  const [error, setError] = useState("");

  const { getUser, isLoading, isAuthenticated } = useKindeAuth();

  useEffect(() => {
    const user = getUser();

    if (!user || user.id.length === 0 || !localUser) {
      if (isLoading) {
        setError("loading");
      }
      if (!isAuthenticated) {
        setError("not logged in");
      }
      const fetchUser = async () => {
        const userId = localUser?.id || user?.id;

        try {
          const { data } = await axios.get(`/api/me?id=${userId}`);
          if (data.success === false) {
            setError("User not logged in");
            alert("login please");
            return;
          }
          setUser({
            email: data.user.email,
            id: data.user.kindeId,
            picture: data.user.picture,
            given_name: data.user.given_name,
            isOnBoarded: data.user.isOnBoarded,
            slots: data.user.slots,
            desiredSleepHours: data.user.desiredSleepHours,
            mongoId: data.user._id,
          });
        } catch (error) {
          setError("error in getLoggedInUser");
          console.error(error);
        }
      };

      fetchUser();
    }
  }, [setUser, isLoading, getUser, localUser, isAuthenticated]);

  return { localUser, error };
}
