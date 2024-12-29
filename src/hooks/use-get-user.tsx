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

    if (!localUser?.id.length) {
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
            return;
          }
          setUser({
            email: data.user.email,
            id: data.user.kindeId,
            picture: data.user.picture,
            given_name: data.user.given_name,
            isOnBoarded: data.user.isOnBoarded,
            mongoId: data.user._id,
            versions: data.user.versions,
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
