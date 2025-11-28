"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/useAuthStore";

export default function Home(): null {
  const router = useRouter();
  const { isAuthenticated, checkExpiration } = useAuthStore();

  useEffect(() => {
    const isValid = checkExpiration();

    if (isAuthenticated && isValid) {
      // Redirect to user dashboard if authenticated
      router.push("/explore");
    } else {
      // Redirect to auth page if not authenticated
      router.push("/auth");
    }
  }, [isAuthenticated, checkExpiration, router]);

  return null;
}
