"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, checkExpiration } = useAuthStore();

  useEffect(() => {
    const isValid = checkExpiration();

    if (isAuthenticated && isValid) {
      // Redirect to user dashboard if authenticated
      router.push("/user");
    } else {
      // Redirect to auth page if not authenticated
      router.push("/auth");
    }
  }, [isAuthenticated, checkExpiration, router]);

  return null;
}
